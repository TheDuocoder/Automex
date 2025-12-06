"""
Email service for sending notifications
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
import asyncio

from automex_backend.config import settings


def create_booking_email_template(
    user_name: str,
    user_email: str,
    user_phone: Optional[str],
    booking_id: int,
    service_name: str,
    car_brand: str,
    car_model: str,
    fuel_type: str,
    booking_date: datetime,
    booking_status: str = "Pending",
    pickup_address: Optional[str] = None,
    special_instructions: Optional[str] = None,
    estimated_cost: Optional[float] = None
) -> str:
    """
    Create HTML email template for booking notification
    """
    # Format booking date
    formatted_date = booking_date.strftime("%B %d, %Y at %I:%M %p")
    
    # Format phone number for display
    phone_display = user_phone if user_phone else "Not provided"
    
    # Build conditional HTML sections
    estimated_cost_section = ""
    if estimated_cost:
        estimated_cost_section = f"""
                    <div class="info-row">
                        <span class="info-label">Estimated Cost:</span>
                        <span class="info-value">₹{estimated_cost:,.2f}</span>
                    </div>
        """
    
    pickup_address_section = ""
    if pickup_address:
        pickup_address_section = f"""
                <div class="info-section">
                    <h2 style="margin-top: 0; color: #667eea;">Pickup Information</h2>
                    <div class="info-row">
                        <span class="info-label">Pickup Address:</span>
                        <span class="info-value">{pickup_address}</span>
                    </div>
                </div>
        """
    
    special_instructions_section = ""
    if special_instructions:
        special_instructions_section = f"""
                <div class="info-section">
                    <h2 style="margin-top: 0; color: #667eea;">Special Instructions</h2>
                    <p style="margin: 0; padding: 10px; background-color: #fff9e6; border-left: 4px solid #ffc107; border-radius: 4px;">
                        {special_instructions}
                    </p>
                </div>
        """
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Service Booking - AutoMex</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }}
            .container {{
                background-color: #ffffff;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 10px 10px 0 0;
                margin: -30px -30px 30px -30px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 24px;
            }}
            .content {{
                margin: 20px 0;
            }}
            .info-section {{
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 15px 0;
                border-left: 4px solid #667eea;
            }}
            .info-row {{
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #e0e0e0;
            }}
            .info-row:last-child {{
                border-bottom: none;
            }}
            .info-label {{
                font-weight: bold;
                color: #555;
                width: 40%;
            }}
            .info-value {{
                color: #333;
                width: 60%;
                text-align: right;
            }}
            .status-badge {{
                display: inline-block;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }}
            .status-pending {{
                background-color: #fff3cd;
                color: #856404;
            }}
            .footer {{
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #e0e0e0;
                text-align: center;
                color: #666;
                font-size: 12px;
            }}
            .button {{
                display: inline-block;
                padding: 12px 30px;
                background-color: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚗 New Service Booking Received</h1>
            </div>
            
            <div class="content">
                <p>Dear AutoMex Sales Team,</p>
                
                <p><strong>A new service booking has been received from {user_name} ({user_email})</strong>. Please find the complete booking details below:</p>
                
                <div class="info-section">
                    <h2 style="margin-top: 0; color: #667eea;">Booking Information</h2>
                    
                    <div class="info-row">
                        <span class="info-label">Booking ID:</span>
                        <span class="info-value"><strong>#{booking_id}</strong></span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Service:</span>
                        <span class="info-value">{service_name}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Booking Date:</span>
                        <span class="info-value">{formatted_date}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Status:</span>
                        <span class="info-value">
                            <span class="status-badge status-pending">{booking_status}</span>
                        </span>
                    </div>
                </div>
                
                <div class="info-section">
                    <h2 style="margin-top: 0; color: #667eea;">Vehicle Details</h2>
                    
                    <div class="info-row">
                        <span class="info-label">Brand:</span>
                        <span class="info-value">{car_brand}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Model:</span>
                        <span class="info-value">{car_model}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Fuel Type:</span>
                        <span class="info-value">{fuel_type}</span>
                    </div>
                    {estimated_cost_section}
                </div>
                
                {pickup_address_section}
                
                {special_instructions_section}
                
                <div class="info-section">
                    <h2 style="margin-top: 0; color: #667eea;">Customer Information</h2>
                    
                    <div class="info-row">
                        <span class="info-label">Name:</span>
                        <span class="info-value">{user_name}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Email:</span>
                        <span class="info-value">{user_email}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Phone:</span>
                        <span class="info-value">{phone_display}</span>
                    </div>
                </div>
                
                <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; border-left: 4px solid #2196F3; margin-top: 30px;">
                    <p style="margin: 0 0 10px 0;"><strong>📧 Customer Contact:</strong></p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:{user_email}" style="color: #2196F3; text-decoration: none;">{user_email}</a></p>
                    <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:{phone_display}" style="color: #2196F3; text-decoration: none;">{phone_display}</a></p>
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">💡 <em>You can reply directly to this email to contact the customer.</em></p>
                </div>
                
                <p style="margin-top: 30px;">
                    <strong>Action Required:</strong> Please review this booking and contact the customer to confirm the appointment.
                </p>
            </div>
            
            <div class="footer">
                <p>This is an automated notification from AutoMex Booking System.</p>
                <p>&copy; {datetime.now().year} AutoMex. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return html_content


async def send_booking_email(
    user_name: str,
    user_email: str,
    user_phone: Optional[str],
    booking_id: int,
    service_name: str,
    car_brand: str,
    car_model: str,
    fuel_type: str,
    booking_date: datetime,
    booking_status: str = "Pending",
    recipient_email: str = "sales@automex.in",
    pickup_address: Optional[str] = None,
    special_instructions: Optional[str] = None,
    estimated_cost: Optional[float] = None
) -> bool:
    """
    Send booking notification email to sales team
    
    Args:
        user_name: Name of the user who made the booking
        user_email: Email of the user who made the booking
        user_phone: Phone number of the user
        booking_id: ID of the booking
        service_name: Name of the service booked
        car_brand: Brand of the car
        car_model: Model of the car
        fuel_type: Fuel type of the car
        booking_date: Date and time of the booking
        booking_status: Status of the booking
        recipient_email: Email address to send notification to (default: sales@automex.in)
    
    Returns:
        True if email sent successfully, False otherwise
    """
    try:
        # Check if SMTP is configured
        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            error_msg = "[WARNING] SMTP credentials not configured. Email notification skipped."
            print(error_msg)
            print(f"[DEBUG] SMTP_USER: {'Set' if settings.SMTP_USER else 'Not Set'}")
            print(f"[DEBUG] SMTP_PASSWORD: {'Set' if settings.SMTP_PASSWORD else 'Not Set'}")
            print(f"[DEBUG] SMTP_HOST: {settings.SMTP_HOST}")
            print(f"[DEBUG] SMTP_PORT: {settings.SMTP_PORT}")
            return False
        
        # Create email template
        html_content = create_booking_email_template(
            user_name=user_name,
            user_email=user_email,
            user_phone=user_phone,
            booking_id=booking_id,
            service_name=service_name,
            car_brand=car_brand,
            car_model=car_model,
            fuel_type=fuel_type,
            booking_date=booking_date,
            booking_status=booking_status,
            pickup_address=pickup_address,
            special_instructions=special_instructions,
            estimated_cost=estimated_cost
        )
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"New Service Booking #{booking_id} - {service_name} from {user_name}"
        # Send from SMTP account to avoid spam/authentication issues
        # But set Reply-To to user's email so replies go directly to the customer
        msg['From'] = f"AutoMex Booking System <{settings.SMTP_USER}>"
        msg['To'] = recipient_email
        msg['Reply-To'] = user_email
        # Add headers to identify the customer
        msg['X-Customer-Name'] = user_name
        msg['X-Customer-Email'] = user_email
        
        # Add HTML content
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # Add plain text fallback
        text_content = f"""
New Service Booking Received from {user_name} ({user_email})

========================================
BOOKING INFORMATION
========================================
Booking ID: #{booking_id}
Service: {service_name}
Booking Date: {booking_date.strftime("%B %d, %Y at %I:%M %p")}
Status: {booking_status}
{f'Estimated Cost: ₹{estimated_cost:,.2f}' if estimated_cost else ''}

========================================
VEHICLE DETAILS
========================================
Brand: {car_brand}
Model: {car_model}
Fuel Type: {fuel_type}

{f'''
========================================
PICKUP INFORMATION
========================================
Pickup Address: {pickup_address}
''' if pickup_address else ''}

{f'''
========================================
SPECIAL INSTRUCTIONS
========================================
{special_instructions}
''' if special_instructions else ''}

========================================
CUSTOMER INFORMATION
========================================
Name: {user_name}
Email: {user_email}
Phone: {phone_display}

========================================
ACTION REQUIRED
========================================
Please review this booking and contact the customer to confirm the appointment.

You can reply directly to this email to contact the customer at {user_email}.

This is an automated notification from AutoMex Booking System.
        """
        text_part = MIMEText(text_content, 'plain')
        msg.attach(text_part)
        
        # Send email using SMTP (synchronous operation)
        def _send_email():
            try:
                print(f"[DEBUG] Connecting to SMTP server: {settings.SMTP_HOST}:{settings.SMTP_PORT}")
                with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=30) as server:
                    print("[DEBUG] Starting TLS...")
                    server.starttls()
                    print(f"[DEBUG] Logging in as: {settings.SMTP_USER}")
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                    print(f"[DEBUG] Sending email to: {recipient_email}")
                    server.send_message(msg)
                    print("[DEBUG] Email sent successfully")
            except smtplib.SMTPAuthenticationError as auth_error:
                print(f"[ERROR] SMTP Authentication failed: {str(auth_error)}")
                raise
            except smtplib.SMTPException as smtp_error:
                print(f"[ERROR] SMTP error: {str(smtp_error)}")
                raise
            except Exception as smtp_error:
                print(f"[ERROR] Email sending error: {str(smtp_error)}")
                raise
        
        # Run in thread pool to avoid blocking async event loop
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor() as executor:
            await loop.run_in_executor(executor, _send_email)
        
        print(f"[INFO] Booking email sent successfully to {recipient_email} for booking #{booking_id}")
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        error_msg = f"SMTP authentication failed. Please check your email credentials."
        print(f"[ERROR] {error_msg}: {str(e)}")
        import traceback
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return False
    except smtplib.SMTPException as e:
        error_msg = f"SMTP server error: {str(e)}"
        print(f"[ERROR] {error_msg}")
        import traceback
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return False
    except Exception as e:
        error_msg = f"Failed to send booking email: {str(e)}"
        print(f"[ERROR] {error_msg}")
        import traceback
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return False


def create_status_update_email_template(
    user_name: str,
    booking_id: int,
    service_name: str,
    car_brand: str,
    car_model: str,
    old_status: str,
    new_status: str,
    booking_date: datetime
) -> str:
    """
    Create HTML email template for booking status update notification
    """
    # Format booking date
    formatted_date = booking_date.strftime("%B %d, %Y at %I:%M %p")
    
    # Status color mapping
    status_colors = {
        "pending": "#ffc107",
        "analyse": "#17a2b8",
        "in_progress": "#007bff",
        "completed": "#28a745",
        "cancelled": "#dc3545"
    }
    
    status_display_names = {
        "pending": "Pending",
        "analyse": "Under Analysis",
        "in_progress": "In Progress",
        "completed": "Completed",
        "cancelled": "Cancelled"
    }
    
    status_color = status_colors.get(new_status.lower(), "#667eea")
    new_status_display = status_display_names.get(new_status.lower(), new_status.title())
    old_status_display = status_display_names.get(old_status.lower(), old_status.title())
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Status Update - AutoMex</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }}
            .container {{
                background-color: #ffffff;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 10px 10px 0 0;
                margin: -30px -30px 30px -30px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 24px;
            }}
            .status-change {{
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid {status_color};
                text-align: center;
            }}
            .status-badge {{
                display: inline-block;
                padding: 10px 20px;
                border-radius: 25px;
                font-size: 16px;
                font-weight: bold;
                text-transform: uppercase;
                background-color: {status_color};
                color: white;
                margin: 10px 0;
            }}
            .info-section {{
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 15px 0;
                border-left: 4px solid #667eea;
            }}
            .info-row {{
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #e0e0e0;
            }}
            .info-row:last-child {{
                border-bottom: none;
            }}
            .info-label {{
                font-weight: bold;
                color: #555;
                width: 40%;
            }}
            .info-value {{
                color: #333;
                width: 60%;
                text-align: right;
            }}
            .footer {{
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #e0e0e0;
                text-align: center;
                color: #666;
                font-size: 12px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📋 Booking Status Updated</h1>
            </div>
            
            <div class="content">
                <p>Dear {user_name},</p>
                
                <p>We're writing to inform you that your service booking status has been updated.</p>
                
                <div class="status-change">
                    <p style="margin: 0 0 10px 0; color: #666;">Status Changed From:</p>
                    <span class="status-badge" style="background-color: #6c757d;">{old_status_display}</span>
                    <p style="margin: 20px 0 10px 0; font-size: 24px;">→</p>
                    <p style="margin: 0 0 10px 0; color: #666;">Status Changed To:</p>
                    <span class="status-badge">{new_status_display}</span>
                </div>
                
                <div class="info-section">
                    <h2 style="margin-top: 0; color: #667eea;">Booking Details</h2>
                    
                    <div class="info-row">
                        <span class="info-label">Booking ID:</span>
                        <span class="info-value"><strong>#{booking_id}</strong></span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Service:</span>
                        <span class="info-value">{service_name}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Vehicle:</span>
                        <span class="info-value">{car_brand} {car_model}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Scheduled Date:</span>
                        <span class="info-value">{formatted_date}</span>
                    </div>
                </div>
                
                <p style="margin-top: 30px;">
                    <strong>Next Steps:</strong> Please check your booking dashboard for more details and updates on your service.
                </p>
                
                <p style="margin-top: 20px;">
                    If you have any questions or concerns, please don't hesitate to contact us at <a href="mailto:sales@automex.in" style="color: #667eea;">sales@automex.in</a> or call us.
                </p>
            </div>
            
            <div class="footer">
                <p>This is an automated notification from AutoMex.</p>
                <p>&copy; {datetime.now().year} AutoMex. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return html_content


def create_work_log_email_template(
    user_name: str,
    booking_id: int,
    service_name: str,
    car_brand: str,
    car_model: str,
    log_date: str,
    description: Optional[str],
    photos_count: int = 0,
    videos_count: int = 0
) -> str:
    """
    Create HTML email template for daily work log notification
    """
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Work Progress Update - AutoMex</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }}
            .container {{
                background-color: #ffffff;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 10px 10px 0 0;
                margin: -30px -30px 30px -30px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 24px;
            }}
            .update-badge {{
                background-color: #e7f3ff;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #2196F3;
                margin: 20px 0;
                text-align: center;
            }}
            .info-section {{
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 15px 0;
                border-left: 4px solid #667eea;
            }}
            .info-row {{
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #e0e0e0;
            }}
            .info-row:last-child {{
                border-bottom: none;
            }}
            .info-label {{
                font-weight: bold;
                color: #555;
                width: 40%;
            }}
            .info-value {{
                color: #333;
                width: 60%;
                text-align: right;
            }}
            .description-box {{
                background-color: #fff9e6;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #ffc107;
                margin: 15px 0;
            }}
            .media-count {{
                display: inline-block;
                background-color: #667eea;
                color: white;
                padding: 5px 12px;
                border-radius: 15px;
                font-size: 12px;
                font-weight: bold;
                margin: 5px;
            }}
            .footer {{
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #e0e0e0;
                text-align: center;
                color: #666;
                font-size: 12px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔧 Work Progress Update</h1>
            </div>
            
            <div class="content">
                <p>Dear {user_name},</p>
                
                <p>We're excited to share an update on your vehicle's service progress!</p>
                
                <div class="update-badge">
                    <p style="margin: 0; font-size: 18px; font-weight: bold; color: #2196F3;">
                        📅 Work Log Added for {log_date}
                    </p>
                </div>
                
                <div class="info-section">
                    <h2 style="margin-top: 0; color: #667eea;">Booking Details</h2>
                    
                    <div class="info-row">
                        <span class="info-label">Booking ID:</span>
                        <span class="info-value"><strong>#{booking_id}</strong></span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Service:</span>
                        <span class="info-value">{service_name}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Vehicle:</span>
                        <span class="info-value">{car_brand} {car_model}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Work Date:</span>
                        <span class="info-value">{log_date}</span>
                    </div>
                </div>
                
                {f'''
                <div class="description-box">
                    <h3 style="margin-top: 0; color: #856404;">Work Description:</h3>
                    <p style="margin: 0; color: #333;">{description}</p>
                </div>
                ''' if description else ''}
                
                {f'''
                <div class="info-section">
                    <h2 style="margin-top: 0; color: #667eea;">Media Updates</h2>
                    <p style="text-align: center; margin: 10px 0;">
                        {f'<span class="media-count">📷 {photos_count} Photo{"s" if photos_count > 1 else ""}</span>' if photos_count > 0 else ''}
                        {f'<span class="media-count">🎥 {videos_count} Video{"s" if videos_count > 1 else ""}</span>' if videos_count > 0 else ''}
                    </p>
                    <p style="text-align: center; color: #666; font-size: 14px; margin-top: 10px;">
                        Check your booking dashboard to view the photos and videos!
                    </p>
                </div>
                ''' if (photos_count > 0 or videos_count > 0) else ''}
                
                <p style="margin-top: 30px;">
                    <strong>View Full Details:</strong> Log in to your AutoMex account to see complete work logs, photos, and videos of your vehicle's service progress.
                </p>
                
                <p style="margin-top: 20px;">
                    If you have any questions, please contact us at <a href="mailto:sales@automex.in" style="color: #667eea;">sales@automex.in</a>.
                </p>
            </div>
            
            <div class="footer">
                <p>This is an automated notification from AutoMex.</p>
                <p>&copy; {datetime.now().year} AutoMex. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return html_content


async def send_status_update_email(
    user_name: str,
    user_email: str,
    booking_id: int,
    service_name: str,
    car_brand: str,
    car_model: str,
    old_status: str,
    new_status: str,
    booking_date: datetime,
    sender_email: str = "sales@automex.in"
) -> bool:
    """
    Send booking status update notification email to user
    
    Args:
        user_name: Name of the user
        user_email: Email of the user
        booking_id: ID of the booking
        service_name: Name of the service
        car_brand: Brand of the car
        car_model: Model of the car
        old_status: Previous status
        new_status: New status
        booking_date: Date and time of the booking
        sender_email: Email address to send from (default: sales@automex.in)
    
    Returns:
        True if email sent successfully, False otherwise
    """
    try:
        # Check if SMTP is configured
        print(f"[DEBUG] Checking SMTP configuration...")
        print(f"[DEBUG] SMTP_USER: {'Set (' + settings.SMTP_USER[:3] + '...)' if settings.SMTP_USER else 'Not Set'}")
        print(f"[DEBUG] SMTP_PASSWORD: {'Set' if settings.SMTP_PASSWORD else 'Not Set'}")
        print(f"[DEBUG] SMTP_HOST: {settings.SMTP_HOST}")
        print(f"[DEBUG] SMTP_PORT: {settings.SMTP_PORT}")
        
        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            error_msg = "[WARNING] SMTP credentials not configured. Email notification skipped."
            print(error_msg)
            return False
        
        print(f"[DEBUG] Creating email template for booking #{booking_id}...")
        try:
            # Create email template
            html_content = create_status_update_email_template(
                user_name=user_name,
                booking_id=booking_id,
                service_name=service_name,
                car_brand=car_brand,
                car_model=car_model,
                old_status=old_status,
                new_status=new_status,
                booking_date=booking_date
            )
            print(f"[DEBUG] Email template created successfully (length: {len(html_content)} chars)")
        except Exception as template_error:
            print(f"[ERROR] Failed to create email template: {str(template_error)}")
            import traceback
            print(f"[ERROR] Template error traceback: {traceback.format_exc()}")
            raise
        
        # Create message
        print(f"[DEBUG] Creating email message...")
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"AutoMex Booking Update: Status Changed for #{booking_id}"
        msg['From'] = f"AutoMex <{settings.SMTP_USER}>"  # Use SMTP_USER for authentication
        msg['To'] = user_email
        msg['Reply-To'] = settings.SMTP_USER  # Replies go to sales/support
        
        # Add HTML content
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        print(f"[DEBUG] Email message created successfully")
        
        # Add plain text fallback
        text_content = f"""
Booking Status Update - AutoMex

Dear {user_name},

Your service booking status has been updated.

Booking ID: #{booking_id}
Service: {service_name}
Vehicle: {car_brand} {car_model}
Scheduled Date: {booking_date.strftime("%B %d, %Y at %I:%M %p")}

Status Changed: {old_status.title()} → {new_status.title()}

Please check your booking dashboard for more details.

If you have any questions, please contact us at {sender_email}.

This is an automated notification from AutoMex.
        """
        text_part = MIMEText(text_content, 'plain')
        msg.attach(text_part)
        
        # Send email using SMTP
        def _send_email():
            try:
                print(f"[DEBUG] Connecting to SMTP server: {settings.SMTP_HOST}:{settings.SMTP_PORT}")
                with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=30) as server:
                    print("[DEBUG] Starting TLS...")
                    server.starttls()
                    print(f"[DEBUG] Logging in as: {settings.SMTP_USER}")
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                    print(f"[DEBUG] Sending email to: {user_email}")
                    server.send_message(msg)
                    print("[DEBUG] Email sent successfully")
            except smtplib.SMTPAuthenticationError as auth_error:
                print(f"[ERROR] SMTP Authentication failed: {str(auth_error)}")
                raise
            except smtplib.SMTPException as smtp_error:
                print(f"[ERROR] SMTP error: {str(smtp_error)}")
                raise
            except Exception as smtp_error:
                print(f"[ERROR] Email sending error: {str(smtp_error)}")
                raise
        
        # Run in thread pool to avoid blocking async event loop
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor() as executor:
            await loop.run_in_executor(executor, _send_email)
        
        print(f"[INFO] Status update email sent successfully to {user_email} for booking #{booking_id}")
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        error_msg = f"SMTP authentication failed. Please check your email credentials."
        print(f"[ERROR] {error_msg}: {str(e)}")
        import traceback
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return False
    except smtplib.SMTPException as e:
        error_msg = f"SMTP server error: {str(e)}"
        print(f"[ERROR] {error_msg}")
        import traceback
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return False
    except Exception as e:
        error_msg = f"Failed to send status update email: {str(e)}"
        print(f"[ERROR] {error_msg}")
        import traceback
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return False


async def send_work_log_email(
    user_name: str,
    user_email: str,
    booking_id: int,
    service_name: str,
    car_brand: str,
    car_model: str,
    log_date: str,
    description: Optional[str],
    photos_count: int = 0,
    videos_count: int = 0,
    sender_email: str = "sales@automex.in"
) -> bool:
    """
    Send daily work log notification email to user
    
    Args:
        user_name: Name of the user
        user_email: Email of the user
        booking_id: ID of the booking
        service_name: Name of the service
        car_brand: Brand of the car
        car_model: Model of the car
        log_date: Date of the work log
        description: Description of the work done
        photos_count: Number of photos uploaded
        videos_count: Number of videos uploaded
        sender_email: Email address to send from (default: sales@automex.in)
    
    Returns:
        True if email sent successfully, False otherwise
    """
    try:
        # Check if SMTP is configured
        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            print("[WARNING] SMTP credentials not configured. Email notification skipped.")
            return False
        
        # Create email template
        html_content = create_work_log_email_template(
            user_name=user_name,
            booking_id=booking_id,
            service_name=service_name,
            car_brand=car_brand,
            car_model=car_model,
            log_date=log_date,
            description=description,
            photos_count=photos_count,
            videos_count=videos_count
        )
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Work Progress Update - Booking #{booking_id}"
        msg['From'] = f"AutoMex <{settings.SMTP_USER}>"  # Use SMTP_USER for authentication
        msg['To'] = user_email
        msg['Reply-To'] = settings.SMTP_USER  # Replies go to sales/support
        
        # Add HTML content
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # Add plain text fallback
        text_content = f"""
Work Progress Update - AutoMex

Dear {user_name},

We've added a work log update for your vehicle's service.

Booking ID: #{booking_id}
Service: {service_name}
Vehicle: {car_brand} {car_model}
Work Date: {log_date}

{f'Work Description: {description}' if description else ''}

{f'Photos: {photos_count}' if photos_count > 0 else ''}
{f'Videos: {videos_count}' if videos_count > 0 else ''}

Please check your booking dashboard to view the complete work log with photos and videos.

If you have any questions, please contact us at {sender_email}.

This is an automated notification from AutoMex.
        """
        text_part = MIMEText(text_content, 'plain')
        msg.attach(text_part)
        
        # Send email using SMTP
        def _send_email():
            try:
                print(f"[DEBUG] Connecting to SMTP server: {settings.SMTP_HOST}:{settings.SMTP_PORT}")
                with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=30) as server:
                    print("[DEBUG] Starting TLS...")
                    server.starttls()
                    print(f"[DEBUG] Logging in as: {settings.SMTP_USER}")
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                    print(f"[DEBUG] Sending email to: {user_email}")
                    server.send_message(msg)
                    print("[DEBUG] Email sent successfully")
            except smtplib.SMTPAuthenticationError as auth_error:
                print(f"[ERROR] SMTP Authentication failed: {str(auth_error)}")
                raise
            except smtplib.SMTPException as smtp_error:
                print(f"[ERROR] SMTP error: {str(smtp_error)}")
                raise
            except Exception as smtp_error:
                print(f"[ERROR] Email sending error: {str(smtp_error)}")
                raise
        
        # Run in thread pool to avoid blocking async event loop
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor() as executor:
            await loop.run_in_executor(executor, _send_email)
        
        print(f"[INFO] Work log email sent successfully to {user_email} for booking #{booking_id}")
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        error_msg = f"SMTP authentication failed. Please check your email credentials."
        print(f"[ERROR] {error_msg}: {str(e)}")
        import traceback
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return False
    except smtplib.SMTPException as e:
        error_msg = f"SMTP server error: {str(e)}"
        print(f"[ERROR] {error_msg}")
        import traceback
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return False
    except Exception as e:
        error_msg = f"Failed to send work log email: {str(e)}"
        print(f"[ERROR] {error_msg}")
        import traceback
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return False

