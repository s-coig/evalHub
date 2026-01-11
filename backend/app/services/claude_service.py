import json
from typing import Any
from app.config import get_settings
from app.models.generated_report import Recommendation

settings = get_settings()


PROMPT_TEMPLATE = """You are an AI assistant helping ML teams communicate evaluation results to non-technical leadership.

Given the following evaluation data:

PROJECT CONTEXT:
{project_description}

METRICS:
{metrics_json}

SUCCESS CRITERIA:
{success_criteria}

BASELINE COMPARISON:
{baseline_metrics}

STAKEHOLDER CONCERNS:
{concerns}

BUSINESS IMPACT:
{business_impact}

Generate an executive summary that answers:
1. **Recommendation**: Should we ship this? (Ship / Needs Work / Block)
2. **Key Findings**: What are the 3 most important takeaways?
3. **Business Impact**: What does this mean for our users/product?
4. **Risk Assessment**: What could go wrong if we ship?
5. **Trade-offs**: What are we optimizing for vs. sacrificing?

Format the response as clear, concise paragraphs suitable for a busy executive. Avoid jargon. Use percentages and comparisons to baselines.

IMPORTANT: Structure your response as JSON with the following format:
{{
    "recommendation": "ship" | "needs_work" | "block",
    "summary": "Executive summary paragraph",
    "key_findings": ["finding1", "finding2", "finding3"],
    "risk_assessment": "Risk assessment paragraph",
    "trade_offs": "Trade-offs paragraph"
}}
"""


async def generate_summary(raw_data: dict[str, Any], context: dict[str, Any]) -> dict[str, Any]:
    if settings.use_mock_claude:
        return _generate_mock_summary(raw_data, context)

    return await _generate_claude_summary(raw_data, context)


def _generate_mock_summary(raw_data: dict[str, Any], context: dict[str, Any]) -> dict[str, Any]:
    metrics = raw_data.get("metrics", {})
    baseline_metrics = raw_data.get("baseline_metrics", {})
    success_criteria = context.get("success_criteria", {})
    project_desc = context.get("project_description", "AI/ML project")
    stakeholder_concerns = context.get("stakeholder_concerns", [])
    business_impact = context.get("business_impact", "")

    test_total = raw_data.get("test_cases_total", 0)
    test_passed = raw_data.get("test_cases_passed", 0)
    pass_rate = test_passed / max(test_total, 1)

    # Extract key metrics with fallbacks
    accuracy = metrics.get("accuracy", metrics.get("acc", 0))
    precision = metrics.get("precision", 0)
    recall = metrics.get("recall", 0)
    latency = metrics.get("latency_p95_ms", metrics.get("latency_ms", metrics.get("latency", 0)))
    cost = metrics.get("cost_per_1k_requests", metrics.get("cost_per_1k", metrics.get("cost", 0)))
    hallucination = metrics.get("hallucination_rate", metrics.get("hallucination", 0))

    # Baseline comparisons
    baseline_accuracy = baseline_metrics.get("accuracy", accuracy * 0.95)
    baseline_latency = baseline_metrics.get("latency_p95_ms", latency * 1.15)
    baseline_cost = baseline_metrics.get("cost_per_1k_requests", cost * 1.2)

    # Calculate improvements
    accuracy_improvement = ((accuracy - baseline_accuracy) / max(baseline_accuracy, 0.001)) * 100
    latency_improvement = ((baseline_latency - latency) / max(baseline_latency, 1)) * 100
    cost_improvement = ((baseline_cost - cost) / max(baseline_cost, 0.001)) * 100

    # Evaluate against success criteria
    criteria_results = []
    all_criteria_met = True
    for key, threshold in success_criteria.items():
        if key in metrics:
            actual = metrics[key]
            if isinstance(threshold, (int, float)) and isinstance(actual, (int, float)):
                # For latency/cost, lower is better
                if "latency" in key.lower() or "cost" in key.lower() or "error" in key.lower() or "hallucination" in key.lower():
                    passed = actual <= threshold
                    criteria_results.append({
                        "metric": key, "target": f"<= {threshold}", "actual": actual, "passed": passed
                    })
                else:
                    passed = actual >= threshold
                    criteria_results.append({
                        "metric": key, "target": f">= {threshold}", "actual": actual, "passed": passed
                    })
                if not passed:
                    all_criteria_met = False

    # Determine recommendation
    critical_failures = sum(1 for c in criteria_results if not c["passed"])
    if all_criteria_met and accuracy_improvement >= 0:
        recommendation = Recommendation.SHIP
    elif critical_failures <= 1 and accuracy_improvement > -5:
        recommendation = Recommendation.NEEDS_WORK
    else:
        recommendation = Recommendation.BLOCK

    # Build rich summary
    summary_parts = []

    # Opening paragraph - bottom line up front
    if recommendation == Recommendation.SHIP:
        summary_parts.append(
            f"**Bottom Line: Ready to Ship.** This evaluation of {project_desc} demonstrates that the model "
            f"meets all critical success criteria and shows meaningful improvement over the baseline. "
            f"We recommend proceeding to production deployment with standard monitoring in place."
        )
    elif recommendation == Recommendation.NEEDS_WORK:
        summary_parts.append(
            f"**Bottom Line: Needs Work.** This evaluation of {project_desc} shows promising results but "
            f"has {critical_failures} area(s) requiring attention before production deployment. "
            f"We recommend targeted improvements followed by re-evaluation."
        )
    else:
        summary_parts.append(
            f"**Bottom Line: Not Ready.** This evaluation of {project_desc} indicates significant gaps "
            f"that must be addressed before considering production deployment. "
            f"We recommend a focused improvement sprint before the next evaluation cycle."
        )

    # Performance overview
    summary_parts.append(
        f"\n\n**Performance Overview:** The model achieved {accuracy:.1%} accuracy across {test_total:,} test cases "
        f"({test_passed:,} passed, {pass_rate:.1%} pass rate). This represents a {'+' if accuracy_improvement >= 0 else ''}{accuracy_improvement:.1f}% "
        f"change compared to the baseline ({baseline_accuracy:.1%}). "
    )

    if precision > 0 and recall > 0:
        f1 = 2 * (precision * recall) / max(precision + recall, 0.001)
        summary_parts.append(
            f"Precision ({precision:.1%}) and recall ({recall:.1%}) are balanced, yielding an F1 score of {f1:.1%}. "
        )

    # Operational metrics
    if latency > 0:
        summary_parts.append(
            f"\n\n**Operational Efficiency:** Response latency at p95 is {latency:.0f}ms "
            f"({'+' if latency_improvement < 0 else ''}{-latency_improvement:.1f}% vs baseline), "
        )
        if latency < 500:
            summary_parts.append("well within acceptable thresholds for real-time applications. ")
        elif latency < 1000:
            summary_parts.append("acceptable for most use cases though optimization may benefit high-volume scenarios. ")
        else:
            summary_parts.append("which may impact user experience in latency-sensitive applications. ")

    if cost > 0:
        monthly_est = cost * 1000  # Rough estimate for 1M requests
        summary_parts.append(
            f"Cost efficiency is ${cost:.4f} per 1K requests (estimated ${monthly_est:,.0f}/month at 1M requests), "
            f"representing a {cost_improvement:.1f}% {'improvement' if cost_improvement > 0 else 'increase'} over baseline."
        )

    # Success criteria summary
    if criteria_results:
        passed_count = sum(1 for c in criteria_results if c["passed"])
        summary_parts.append(
            f"\n\n**Success Criteria:** {passed_count} of {len(criteria_results)} defined criteria met. "
        )
        failed = [c for c in criteria_results if not c["passed"]]
        if failed:
            summary_parts.append("Gaps identified in: " + ", ".join(
                f"{c['metric']} (target: {c['target']}, actual: {c['actual']:.3f})" for c in failed
            ) + ". ")

    # Stakeholder concerns
    if stakeholder_concerns:
        summary_parts.append(
            f"\n\n**Addressing Stakeholder Concerns:** "
        )
        for concern in stakeholder_concerns[:3]:
            concern_lower = concern.lower()
            if "cost" in concern_lower:
                summary_parts.append(f"Regarding {concern}: cost per request is competitive and {cost_improvement:.0f}% better than baseline. ")
            elif "latency" in concern_lower or "speed" in concern_lower or "performance" in concern_lower:
                summary_parts.append(f"Regarding {concern}: p95 latency of {latency:.0f}ms is {'within' if latency < 500 else 'above'} typical SLA thresholds. ")
            elif "accuracy" in concern_lower or "quality" in concern_lower:
                summary_parts.append(f"Regarding {concern}: accuracy improved {accuracy_improvement:.1f}% over baseline with strong precision/recall balance. ")
            elif "trust" in concern_lower or "hallucination" in concern_lower or "safety" in concern_lower:
                summary_parts.append(f"Regarding {concern}: hallucination rate of {hallucination:.1%} is {'low' if hallucination < 0.05 else 'moderate'}, recommend continued monitoring. ")
            else:
                summary_parts.append(f"Regarding {concern}: metrics indicate acceptable performance, though specific monitoring is recommended. ")

    summary = "".join(summary_parts)

    # Generate detailed key findings
    key_findings = []

    # Finding 1: Primary metric performance
    if accuracy_improvement >= 5:
        key_findings.append(
            f"Significant accuracy improvement: Model accuracy increased from {baseline_accuracy:.1%} to {accuracy:.1%} "
            f"(+{accuracy_improvement:.1f}%), exceeding typical iteration gains of 1-3%."
        )
    elif accuracy_improvement >= 0:
        key_findings.append(
            f"Accuracy maintained/improved: Model accuracy is {accuracy:.1%} "
            f"({'+' if accuracy_improvement >= 0 else ''}{accuracy_improvement:.1f}% vs baseline), meeting quality bar."
        )
    else:
        key_findings.append(
            f"Accuracy regression detected: Model accuracy dropped from {baseline_accuracy:.1%} to {accuracy:.1%} "
            f"({accuracy_improvement:.1f}%), requiring investigation before deployment."
        )

    # Finding 2: Test coverage and pass rate
    if test_total > 0:
        if pass_rate >= 0.9:
            key_findings.append(
                f"Strong test coverage: {pass_rate:.1%} of {test_total:,} test cases passed, indicating robust "
                f"performance across diverse scenarios including edge cases."
            )
        elif pass_rate >= 0.7:
            key_findings.append(
                f"Moderate test results: {pass_rate:.1%} pass rate ({test_passed:,}/{test_total:,} cases) suggests "
                f"core functionality works but {test_total - test_passed:,} failure cases need review."
            )
        else:
            key_findings.append(
                f"Test coverage concerns: Only {pass_rate:.1%} of test cases passed ({test_passed:,}/{test_total:,}), "
                f"indicating significant gaps in model capability or test data alignment."
            )

    # Finding 3: Operational readiness
    if latency > 0 and cost > 0:
        if latency < 500 and cost_improvement > 0:
            key_findings.append(
                f"Production-ready operations: Latency ({latency:.0f}ms p95) and cost (${cost:.4f}/1K) are both "
                f"within target ranges and improved vs baseline, supporting immediate deployment."
            )
        elif latency < 1000:
            key_findings.append(
                f"Operationally viable: Latency ({latency:.0f}ms p95) is acceptable for most use cases. "
                f"Cost at ${cost:.4f}/1K requests {'improved' if cost_improvement > 0 else 'increased'} {abs(cost_improvement):.0f}% vs baseline."
            )
        else:
            key_findings.append(
                f"Operational optimization needed: Current latency ({latency:.0f}ms p95) may impact user experience. "
                f"Consider model optimization or infrastructure scaling before high-volume deployment."
            )

    # Finding 4: Quality/Safety (if hallucination data exists)
    if hallucination > 0:
        if hallucination < 0.03:
            key_findings.append(
                f"Low hallucination risk: {hallucination:.1%} hallucination rate is well below industry threshold of 5%, "
                f"indicating reliable outputs suitable for customer-facing applications."
            )
        elif hallucination < 0.08:
            key_findings.append(
                f"Moderate hallucination rate: {hallucination:.1%} of responses contained hallucinations, "
                f"acceptable for assisted workflows but recommend human review for critical decisions."
            )
        else:
            key_findings.append(
                f"Elevated hallucination risk: {hallucination:.1%} hallucination rate exceeds acceptable threshold. "
                f"Recommend additional fine-tuning or guardrails before production deployment."
            )

    # Finding 5: Criteria compliance
    if criteria_results:
        passed = [c for c in criteria_results if c["passed"]]
        failed = [c for c in criteria_results if not c["passed"]]
        if len(failed) == 0:
            key_findings.append(
                f"All success criteria met: Model passed all {len(criteria_results)} defined thresholds, "
                f"validating readiness against business requirements."
            )
        else:
            key_findings.append(
                f"Criteria gaps identified: {len(failed)} of {len(criteria_results)} success criteria not met "
                f"({', '.join(c['metric'] for c in failed)}). Targeted improvements required."
            )

    # Limit to 5 findings
    key_findings = key_findings[:5]

    # Generate detailed risk assessment
    risks = []

    if hallucination > 0.03:
        risks.append(
            f"**Hallucination Risk (Medium-High):** Current rate of {hallucination:.1%} could lead to user trust issues "
            f"or incorrect decisions if outputs are not validated. Mitigation: Implement output validation layer, "
            f"add confidence scoring, consider human-in-the-loop for high-stakes responses."
        )

    if accuracy_improvement < 0:
        risks.append(
            f"**Regression Risk (High):** Accuracy has decreased {abs(accuracy_improvement):.1f}% from baseline, "
            f"potentially impacting user experience. Mitigation: Root cause analysis of failure cases, "
            f"targeted fine-tuning on underperforming segments, A/B testing before full rollout."
        )

    if latency > 800:
        risks.append(
            f"**Latency Risk (Medium):** P95 latency of {latency:.0f}ms may cause user frustration or timeout issues. "
            f"Mitigation: Investigate model optimization, consider async processing patterns, "
            f"implement client-side loading states."
        )

    risks.append(
        f"**Model Drift Risk (Standard):** All ML models degrade over time as real-world data diverges from training data. "
        f"Mitigation: Implement continuous monitoring dashboards, set up automated alerts for metric degradation, "
        f"plan quarterly re-evaluation cycles."
    )

    risks.append(
        f"**Edge Case Coverage (Standard):** Evaluation dataset may not capture all production scenarios. "
        f"Mitigation: Shadow mode deployment initially, collect real-world failures for continuous improvement, "
        f"maintain fallback to previous version."
    )

    if not criteria_results or len([c for c in criteria_results if not c["passed"]]) > 0:
        risks.append(
            f"**Success Criteria Gaps (Medium):** Not all defined business thresholds are met, which may impact "
            f"expected ROI or user satisfaction. Mitigation: Prioritize failed criteria in next iteration, "
            f"consider phased rollout with close monitoring."
        )

    risk_assessment = "\n\n".join(risks[:4])

    # Generate trade-offs analysis
    trade_off_points = []

    if accuracy >= 0.85 and latency > 400:
        trade_off_points.append(
            f"**Accuracy vs Speed:** This model prioritizes correctness ({accuracy:.1%} accuracy) over response time "
            f"({latency:.0f}ms). This is appropriate for use cases where wrong answers are costly, but may frustrate "
            f"users expecting instant responses. Consider offering a 'fast mode' with a lighter model for simple queries."
        )

    if cost_improvement < 0:
        trade_off_points.append(
            f"**Quality vs Cost:** Improved model quality comes at {abs(cost_improvement):.0f}% higher cost per request. "
            f"At scale, this represents approximately ${abs(cost_improvement) * cost * 10:.0f}/month additional spend per 1M requests. "
            f"Evaluate whether quality gains justify increased operational costs for your use case."
        )
    elif cost_improvement > 10:
        trade_off_points.append(
            f"**Cost Efficiency Win:** {cost_improvement:.0f}% cost reduction achieved while maintaining quality. "
            f"This represents significant savings at scale (${cost_improvement * cost * 10:.0f}/month per 1M requests) "
            f"and enables expanding usage to more use cases within budget constraints."
        )

    if precision > 0 and recall > 0:
        if precision > recall:
            trade_off_points.append(
                f"**Precision vs Recall:** Model favors precision ({precision:.1%}) over recall ({recall:.1%}), meaning it "
                f"avoids false positives at the cost of missing some true positives. This is suitable for high-stakes "
                f"decisions where false alarms are costly, but may miss opportunities in discovery-focused applications."
            )
        elif recall > precision:
            trade_off_points.append(
                f"**Recall vs Precision:** Model favors recall ({recall:.1%}) over precision ({precision:.1%}), maximizing "
                f"coverage but accepting more false positives. This is suitable for screening/discovery use cases "
                f"but may require downstream filtering for decision-support applications."
            )

    trade_off_points.append(
        f"**Generalization vs Specialization:** Current evaluation reflects {'broad' if test_total > 500 else 'focused'} "
        f"test coverage. A more specialized model might achieve higher accuracy on core use cases at the expense of "
        f"handling edge cases. Consider your traffic distribution when evaluating this trade-off."
    )

    trade_offs = "\n\n".join(trade_off_points[:3])

    return {
        "recommendation": recommendation,
        "summary": summary,
        "key_findings": key_findings,
        "risk_assessment": risk_assessment,
        "trade_offs": trade_offs,
    }


async def _generate_claude_summary(raw_data: dict[str, Any], context: dict[str, Any]) -> dict[str, Any]:
    import anthropic

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    prompt = PROMPT_TEMPLATE.format(
        project_description=context.get("project_description", "N/A"),
        metrics_json=json.dumps(raw_data.get("metrics", {}), indent=2),
        success_criteria=json.dumps(context.get("success_criteria", {}), indent=2),
        baseline_metrics=json.dumps(raw_data.get("baseline_metrics", {}), indent=2),
        concerns=", ".join(context.get("stakeholder_concerns", [])),
        business_impact=context.get("business_impact", "N/A"),
    )

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}],
    )

    response_text = message.content[0].text

    try:
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        if start != -1 and end > start:
            result = json.loads(response_text[start:end])
        else:
            raise ValueError("No JSON found in response")

        rec_map = {
            "ship": Recommendation.SHIP,
            "needs_work": Recommendation.NEEDS_WORK,
            "block": Recommendation.BLOCK,
        }

        return {
            "recommendation": rec_map.get(result.get("recommendation", "").lower(), Recommendation.NEEDS_WORK),
            "summary": result.get("summary", response_text),
            "key_findings": result.get("key_findings", []),
            "risk_assessment": result.get("risk_assessment", ""),
            "trade_offs": result.get("trade_offs", ""),
        }
    except (json.JSONDecodeError, ValueError):
        return {
            "recommendation": Recommendation.NEEDS_WORK,
            "summary": response_text,
            "key_findings": [],
            "risk_assessment": "",
            "trade_offs": "",
        }
