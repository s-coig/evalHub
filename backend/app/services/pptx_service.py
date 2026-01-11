import io
import re
from typing import Any
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR


def strip_markdown(text: str) -> str:
    """Remove markdown formatting from text."""
    # Remove bold markers
    text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
    # Remove italic markers
    text = re.sub(r'\*(.+?)\*', r'\1', text)
    # Remove headers
    text = re.sub(r'^#+\s*', '', text, flags=re.MULTILINE)
    return text.strip()


def add_title_slide(prs: Presentation, title: str, subtitle: str, recommendation: str | None) -> None:
    """Add a title slide with project info and recommendation."""
    slide_layout = prs.slide_layouts[6]  # Blank layout
    slide = prs.slides.add_slide(slide_layout)

    # Background - dark blue gradient effect via shape
    background = slide.shapes.add_shape(1, Inches(0), Inches(0), Inches(10), Inches(7.5))
    background.fill.solid()
    background.fill.fore_color.rgb = RGBColor(30, 58, 95)
    background.line.fill.background()

    # Title
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(2), Inches(9), Inches(1.5))
    tf = title_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)
    p.alignment = PP_ALIGN.CENTER

    # Subtitle
    subtitle_box = slide.shapes.add_textbox(Inches(0.5), Inches(3.5), Inches(9), Inches(0.75))
    tf = subtitle_box.text_frame
    p = tf.paragraphs[0]
    p.text = subtitle
    p.font.size = Pt(24)
    p.font.color.rgb = RGBColor(200, 200, 200)
    p.alignment = PP_ALIGN.CENTER

    # Recommendation badge
    if recommendation:
        colors = {
            'ship': (RGBColor(34, 197, 94), 'READY TO SHIP'),
            'needs_work': (RGBColor(234, 179, 8), 'NEEDS WORK'),
            'block': (RGBColor(239, 68, 68), 'BLOCKED'),
        }
        color, label = colors.get(recommendation, (RGBColor(156, 163, 175), recommendation.upper()))

        badge = slide.shapes.add_shape(1, Inches(3.5), Inches(5), Inches(3), Inches(0.6))
        badge.fill.solid()
        badge.fill.fore_color.rgb = color
        badge.line.fill.background()

        badge_text = slide.shapes.add_textbox(Inches(3.5), Inches(5), Inches(3), Inches(0.6))
        tf = badge_text.text_frame
        tf.word_wrap = False
        p = tf.paragraphs[0]
        p.text = label
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = RGBColor(255, 255, 255)
        p.alignment = PP_ALIGN.CENTER


def add_section_slide(prs: Presentation, title: str, content: str, color: tuple[int, int, int]) -> None:
    """Add a content slide with a colored header."""
    slide_layout = prs.slide_layouts[6]  # Blank
    slide = prs.slides.add_slide(slide_layout)

    # Header bar
    header = slide.shapes.add_shape(1, Inches(0), Inches(0), Inches(10), Inches(1.2))
    header.fill.solid()
    header.fill.fore_color.rgb = RGBColor(*color)
    header.line.fill.background()

    # Title
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.35), Inches(9), Inches(0.5))
    tf = title_box.text_frame
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)

    # Content
    content_box = slide.shapes.add_textbox(Inches(0.5), Inches(1.5), Inches(9), Inches(5.5))
    tf = content_box.text_frame
    tf.word_wrap = True

    # Split content into paragraphs and add them
    paragraphs = strip_markdown(content).split('\n\n')
    for i, para_text in enumerate(paragraphs):
        if not para_text.strip():
            continue
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.text = para_text.strip()
        p.font.size = Pt(16)
        p.font.color.rgb = RGBColor(55, 65, 81)
        p.space_after = Pt(12)


def add_findings_slide(prs: Presentation, findings: list[str]) -> None:
    """Add a slide with key findings."""
    slide_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(slide_layout)

    # Header bar
    header = slide.shapes.add_shape(1, Inches(0), Inches(0), Inches(10), Inches(1.2))
    header.fill.solid()
    header.fill.fore_color.rgb = RGBColor(5, 150, 105)  # Emerald
    header.line.fill.background()

    # Title
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.35), Inches(9), Inches(0.5))
    tf = title_box.text_frame
    p = tf.paragraphs[0]
    p.text = "Key Findings"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)

    # Findings list
    y_offset = 1.5
    for i, finding in enumerate(findings[:5]):  # Max 5 findings per slide
        # Number circle
        circle = slide.shapes.add_shape(9, Inches(0.5), Inches(y_offset), Inches(0.4), Inches(0.4))  # Oval
        circle.fill.solid()
        circle.fill.fore_color.rgb = RGBColor(5, 150, 105)
        circle.line.fill.background()

        num_box = slide.shapes.add_textbox(Inches(0.5), Inches(y_offset), Inches(0.4), Inches(0.4))
        tf = num_box.text_frame
        tf.paragraphs[0].text = str(i + 1)
        tf.paragraphs[0].font.size = Pt(14)
        tf.paragraphs[0].font.bold = True
        tf.paragraphs[0].font.color.rgb = RGBColor(255, 255, 255)
        tf.paragraphs[0].alignment = PP_ALIGN.CENTER

        # Finding text
        text_box = slide.shapes.add_textbox(Inches(1.1), Inches(y_offset), Inches(8.4), Inches(1))
        tf = text_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = strip_markdown(finding)
        p.font.size = Pt(14)
        p.font.color.rgb = RGBColor(55, 65, 81)

        y_offset += 1.1


def add_metrics_slide(prs: Presentation, metrics: dict[str, Any]) -> None:
    """Add a slide with metrics overview."""
    slide_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(slide_layout)

    # Header bar
    header = slide.shapes.add_shape(1, Inches(0), Inches(0), Inches(10), Inches(1.2))
    header.fill.solid()
    header.fill.fore_color.rgb = RGBColor(124, 58, 237)  # Purple
    header.line.fill.background()

    # Title
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.35), Inches(9), Inches(0.5))
    tf = title_box.text_frame
    p = tf.paragraphs[0]
    p.text = "Metrics Overview"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)

    # Metrics grid
    items = list(metrics.items())[:9]  # Max 9 metrics (3x3 grid)
    cols = 3
    card_width = 2.8
    card_height = 1.5
    start_x = 0.5
    start_y = 1.5
    gap = 0.2

    for i, (key, value) in enumerate(items):
        row = i // cols
        col = i % cols
        x = start_x + col * (card_width + gap)
        y = start_y + row * (card_height + gap)

        # Card background
        card = slide.shapes.add_shape(1, Inches(x), Inches(y), Inches(card_width), Inches(card_height))
        card.fill.solid()
        card.fill.fore_color.rgb = RGBColor(243, 244, 246)
        card.line.fill.background()

        # Metric name
        name_box = slide.shapes.add_textbox(Inches(x + 0.15), Inches(y + 0.15), Inches(card_width - 0.3), Inches(0.4))
        tf = name_box.text_frame
        p = tf.paragraphs[0]
        p.text = key.replace('_', ' ').title()
        p.font.size = Pt(11)
        p.font.color.rgb = RGBColor(107, 114, 128)

        # Metric value
        value_box = slide.shapes.add_textbox(Inches(x + 0.15), Inches(y + 0.55), Inches(card_width - 0.3), Inches(0.7))
        tf = value_box.text_frame
        p = tf.paragraphs[0]
        if isinstance(value, float):
            if 0 < value < 1:
                p.text = f"{value:.1%}"
            elif value < 0.01:
                p.text = f"{value:.4f}"
            else:
                p.text = f"{value:.2f}"
        else:
            p.text = str(value)
        p.font.size = Pt(24)
        p.font.bold = True
        p.font.color.rgb = RGBColor(17, 24, 39)


def generate_pptx(report_data: dict[str, Any]) -> bytes:
    """Generate a PowerPoint presentation from report data."""
    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)

    # Title slide
    add_title_slide(
        prs,
        report_data.get('project_name', 'Evaluation Report'),
        report_data.get('run_name', ''),
        report_data.get('recommendation')
    )

    # Executive Summary
    if report_data.get('summary'):
        add_section_slide(
            prs,
            "Executive Summary",
            report_data['summary'],
            (37, 99, 235)  # Blue
        )

    # Key Findings
    if report_data.get('key_findings'):
        add_findings_slide(prs, report_data['key_findings'])

    # Metrics
    if report_data.get('metrics'):
        add_metrics_slide(prs, report_data['metrics'])

    # Risk Assessment
    if report_data.get('risk_assessment'):
        add_section_slide(
            prs,
            "Risk Assessment",
            report_data['risk_assessment'],
            (245, 158, 11)  # Amber
        )

    # Trade-offs
    if report_data.get('trade_offs'):
        add_section_slide(
            prs,
            "Trade-offs Analysis",
            report_data['trade_offs'],
            (79, 70, 229)  # Indigo
        )

    # Save to bytes
    output = io.BytesIO()
    prs.save(output)
    output.seek(0)
    return output.read()
