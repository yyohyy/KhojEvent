from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Spacer, Image, Paragraph
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle

def generate_order_receipt_pdf(order, order_items):
    order_item_data = [
        ["Event Name", "Ticket Name", "Quantity", "Price"]
    ]
    for order_item in order_items:
        order_item_data.append([
            order_item.ticket.ticket.ticket.event.name,
            order_item.ticket.ticket.name,
            order_item.quantity,
            order_item.ticket.ticket.price
        ])

    # Create a ReportLab PDF document
    pdf = SimpleDocTemplate("order_receipt.pdf", pagesize=letter)
    
    # Define styles
    style = TableStyle([
        ('INNERGRID', (0, 0), (-1, -1), 1, colors.HexColor('#f64b4b')),  # Grid lines
        ('BOX', (0, 0), (-1, -1), 1, colors.white),  # No outside border
        ('BACKGROUND', (0, 0), (-1, 0), colors.white),  # Pink background for header row
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),  # White text color for header row
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 16),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),  # White background for data rows
    ])

    header_text = "KhojEvent"
    header_style = ParagraphStyle(
        name='HeaderStyle',
        fontSize=40,
        textColor='#f64b4b',
        alignment=1,  # Set alignment to 'CENTER'
    )
    header = Paragraph(header_text, style=header_style)

    receipt_text="RECEIPT"
    receipt_style = ParagraphStyle(
        name='receiptStyle',
        fontSize=20,
        alignment=1,  # Set alignment to 'CENTER'
    )
    receipt = Paragraph(receipt_text, style=receipt_style)

    order_details = [
        ("Order ID", str(order.id)),
        ("Issued To", f"{order_item.ticket.issued_to.first_name} {order_item.ticket.issued_to.last_name}"),
        ("Created At", order.created_at),

    ]

    order_style = ParagraphStyle(
        name='OrderDetails',
        fontSize=14,
        textColor='black',
        fontName='Helvetica',
        alignment=0  # Left alignment
    )

    # Create a string with each item in order_details on a separate line
    order_details_text = "<br/>""<br/>".join([f"{label}: {value}" for label, value in order_details])

    # Create a Paragraph object with the formatted text
    order_details_paragraph = Paragraph(order_details_text, order_style, encoding='utf-8')

    order_item_table = Table(order_item_data)
    order_item_table.setStyle(style)

    total = f"Total: {order.total_amount}"

    total_style = ParagraphStyle(
        name='TotalStyle',
        fontSize=14,
        alignment=2,  # Set alignment to 'CENTER'
    )
    total_paragraph = Paragraph(total, style=total_style)

    terms = "Terms and conditions: Tickets once issued won't be refunded."
    terms_style = ParagraphStyle(
        name='TermsStyle',
        fontSize=10,
        alignment=1,  # Set alignment to 'CENTER'
    )
    terms_paragraph = Paragraph(terms, style=terms_style)
    terms_spacer = Spacer(1, 12)  # Add some spacing between the table and the terms


    pdf_content = [header, Spacer(1, 50), receipt ,Spacer(1,50) ,order_details_paragraph,Spacer(1, 75),order_item_table,Spacer(1, 50) ,total_paragraph, Spacer(1, 150), terms_spacer, terms_paragraph]

    pdf.build(pdf_content)

    return pdf
