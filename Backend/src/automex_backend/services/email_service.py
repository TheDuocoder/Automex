import httpx
from automex_backend.config import settings
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.api_url = "https://api.emailjs.com/api/v1.0/email/send"
        self.public_key = settings.EMAILJS_PUBLIC_KEY
        self.private_key = settings.EMAILJS_PRIVATE_KEY
        self.service_id = settings.EMAILJS_SERVICE_ID
        self.template_id = settings.EMAILJS_TEMPLATE_ID
        self.booking_template_id = settings.EMAILJS_BOOKING_TEMPLATE_ID

    async def send_welcome_email(self, user_email: str, user_name: str) -> bool:
        """
        Send welcome email using EmailJS
        """
        missing_keys = []
        if not self.public_key: missing_keys.append("EMAILJS_PUBLIC_KEY")
        if not self.private_key: missing_keys.append("EMAILJS_PRIVATE_KEY")
        if not self.service_id: missing_keys.append("EMAILJS_SERVICE_ID")
        if not self.template_id: missing_keys.append("EMAILJS_TEMPLATE_ID")

        if missing_keys:
            print(f"[EMAIL ERROR] EmailJS configuration incomplete. Missing: {', '.join(missing_keys)}. Skipping welcome email.")
            return False

        payload = {
            "service_id": self.service_id,
            "template_id": self.template_id,
            "user_id": self.public_key,
            "accessToken": self.private_key,
            "template_params": {
                "user_name": user_name,
                "to_name": user_name,  # Add standard to_name
                "user_email": user_email,
                "email": user_email,
                "to_email": user_email,
                "content": f"Welcome to AutoMex, {user_name}! We're thrilled to have you.",
                "message": f"Welcome to AutoMex, {user_name}! We're thrilled to have you.",
                "subject": "Welcome to AutoMex!"
            }
        }

        print(f"[EMAIL DEBUG] Attempting to send welcome email to {user_email} using template {self.template_id}")

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(self.api_url, json=payload, timeout=10.0)
                
            if response.status_code == 200:
                print(f"[EMAIL SUCCESS] Welcome email sent successfully to {user_email}. Response: {response.text}")
                return True
            else:
                print(f"[EMAIL ERROR] Failed to send welcome email. Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            print(f"[EMAIL EXCEPTION] Error sending welcome email: {str(e)}")
            return False

    async def send_booking_email(
        self, 
        user_name: str, 
        user_email: str, 
        user_phone: str,
        booking_id: int, 
        service_name: str, 
        car_brand: str, 
        car_model: str, 
        fuel_type: str, 
        booking_date: object,
        booking_status: str,
        pickup_address: str, 
        special_instructions: str,
        estimated_cost: float = None
    ) -> bool:
        """
        Send booking notification email to sales team
        """
        missing_keys = []
        if not self.public_key: missing_keys.append("EMAILJS_PUBLIC_KEY")
        if not self.private_key: missing_keys.append("EMAILJS_PRIVATE_KEY")
        if not self.service_id: missing_keys.append("EMAILJS_SERVICE_ID")
        if not self.booking_template_id: missing_keys.append("EMAILJS_BOOKING_TEMPLATE_ID")

        if missing_keys:
            print(f"[EMAIL ERROR] EmailJS configuration for booking incomplete. Missing: {', '.join(missing_keys)}. Skipping booking email.")
            return False

        # Format date if it's a datetime object
        formatted_date = str(booking_date)
        if hasattr(booking_date, 'strftime'):
            formatted_date = booking_date.strftime("%Y-%m-%d %H:%M")

        payload = {
            "service_id": self.service_id,
            "template_id": self.booking_template_id,
            "user_id": self.public_key,
            "accessToken": self.private_key,
            "template_params": {
                "user_name": str(user_name or "Valued Customer"),
                "to_name": str(user_name or "Valued Customer"), # Mapping for template
                "user_email": str(user_email or ""),
                "user_phone": str(user_phone or "Not provided"),
                "booking_id": str(booking_id),
                "order_id": str(booking_id),
                "id": str(booking_id),
                "service_name": str(service_name or "Service"),
                "car_brand": str(car_brand or "Not specified"),
                "car_model": str(car_model or "Not specified"),
                "fuel_type": str(fuel_type or "Not specified"),
                "booking_date": str(formatted_date),
                "booking_status": str(booking_status or "Pending"),
                "pickup_address": str(pickup_address or ""),
                "special_instructions": str(special_instructions or ""),
                # Standard email fields
                "email": "sales@automex.in",
                "to_email": "sales@automex.in",
                "from_name": str(user_name or "Automex User"),
                "reply_to": str(user_email or ""),
                "message": f"New booking received from {user_name} for {service_name}.",
                "content": f"New booking received from {user_name} for {service_name}."
            }
        }
        
        print(f"[EMAIL DEBUG] Attempting to send booking email #{booking_id} to sales using template {self.booking_template_id}")

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(self.api_url, json=payload, timeout=10.0)
                
            if response.status_code == 200:
                print(f"[EMAIL SUCCESS] Booking email sent successfully for booking #{booking_id}. Response: {response.text}")
                return True
            else:
                print(f"[EMAIL ERROR] Failed to send booking email. Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            print(f"[EMAIL EXCEPTION] Error sending booking email: {str(e)}")
            return False

    async def send_batch_booking_email(
        self,
        user_name: str,
        user_email: str,
        user_phone: str,
        bookings: list,
    ) -> bool:
        """
        Send a single batch email for multiple bookings (part of the same order)
        """
        missing_keys = []
        if not self.public_key: missing_keys.append("EMAILJS_PUBLIC_KEY")
        if not self.private_key: missing_keys.append("EMAILJS_PRIVATE_KEY")
        if not self.service_id: missing_keys.append("EMAILJS_SERVICE_ID")
        if not self.booking_template_id: missing_keys.append("EMAILJS_BOOKING_TEMPLATE_ID")

        if missing_keys:
            print(f"[EMAIL ERROR] EmailJS configuration for batch booking incomplete. Missing: {', '.join(missing_keys)}. Skipping batch email.")
            return False
            
        if not bookings:
            return False
            
        # Use first booking for common details
        first_booking = bookings[0]
        booking_group_id = getattr(first_booking, "booking_group_id", "N/A")
        
        # Generate HTML table for services
        services_html = """
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px;">
            <tr style="background-color: #f2f2f2;">
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Service</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Vehicle</th>
            </tr>
        """
        
        for booking in bookings:
            service_name = booking.service_name or "Service"
            # Try to get service name from relationship if missing
            if hasattr(booking, 'service') and booking.service:
                service_name = booking.service.name
                
            car_brand = booking.car_brand or booking.vehicle_make or "-"
            car_model = booking.car_model or booking.vehicle_model or "-"
            fuel_type = booking.fuel_type or ""
            vehicle = f"{car_brand} {car_model} {fuel_type}".strip()
            
            services_html += f"""
            <tr>
                <td style="border: 1px solid #ddd; padding: 12px;">{service_name}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">{vehicle}</td>
            </tr>
            """
            
        services_html += "</table>"

        # Format date
        booking_date = first_booking.booking_date
        formatted_date = str(booking_date)
        if hasattr(booking_date, 'strftime'):
            formatted_date = booking_date.strftime("%Y-%m-%d %H:%M")

        payload = {
            "service_id": self.service_id,
            "template_id": self.booking_template_id,
            "user_id": self.public_key,
            "accessToken": self.private_key,
            "template_params": {
                "user_name": str(user_name or "Valued Customer"),
                "to_name": str(user_name or "Valued Customer"),
                "user_email": str(user_email or ""),
                "user_phone": str(user_phone or "Not provided"),
                "booking_id": str(booking_group_id), # Use group ID as main ref
                "order_id": str(booking_group_id),
                "services_table": services_html, # New field for HTML table
                "booking_date": str(formatted_date),
                "booking_status": "Pending", # Initial status
                # Standard fields
                "email": "sales@automex.in",
                "to_email": "sales@automex.in",
                "from_name": str(user_name or "Automex User"),
                "reply_to": str(user_email or ""),
                "message": f"New batch booking received from {user_name}.",
                "content": f"New batch booking received from {user_name}."
            }
        }
        
        print(f"[EMAIL DEBUG] Attempting to send batch booking email group {booking_group_id}")

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(self.api_url, json=payload, timeout=10.0)
                
            if response.status_code == 200:
                print(f"[EMAIL SUCCESS] Batch booking email sent successfully for group {booking_group_id}. Response: {response.text}")
                return True
            else:
                print(f"[EMAIL ERROR] Failed to send batch booking email. Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            print(f"[EMAIL EXCEPTION] Error sending batch booking email: {str(e)}")
            return False

email_service = EmailService()

# Export wrapper functions for module-level access (compatibility with existing code)
async def send_booking_email(*args, **kwargs):
    return await email_service.send_booking_email(*args, **kwargs)
