import logging
from .email_service import email_service

logger = logging.getLogger(__name__)

async def send_booking_confirmation_email(
    to_email: str,
    customer_name: str,
    booking_details: list,
    estimated_cost: float = None
) -> bool:
    """
    Send booking confirmation email.
    Adapts the list-based details to the EmailService.send_booking_email signature.
    """
    if not booking_details:
        return False
        
    # We'll take the first item for the main details
    details = booking_details[0]
    
    # Extract details safely
    service_name = details.get("service_name", "")
    car_brand = details.get("car_brand", "")
    car_model = details.get("car_model", "")
    fuel_type = details.get("fuel_type", "")
    booking_date = details.get("booking_date")
    pickup_address = details.get("pickup_address", "")
    special_instructions = details.get("special_instructions", "")
    
    return await email_service.send_booking_email(
        user_name=customer_name,
        user_email=to_email,
        user_phone="", # Phone not always available in this context
        booking_id=details.get("booking_id", 0) if isinstance(details.get("booking_id"), int) else 0, # Fallback
        service_name=service_name,
        car_brand=car_brand,
        car_model=car_model,
        fuel_type=fuel_type,
        booking_date=booking_date,
        booking_status="Pending",
        pickup_address=pickup_address,
        special_instructions=special_instructions,
        estimated_cost=estimated_cost
    )

async def send_pickup_request_email(
    to_email: str,
    customer_name: str,
    booking_id: int,
    service_name: str,
    car_brand: str,
    car_model: str,
    booking_date: object,
    pickup_address: str,
    status: str,
    old_status: str
) -> bool:
    """
    Send pickup request / status update email.
    """
    return await email_service.send_booking_email(
        user_name=customer_name,
        user_email=to_email,
        user_phone="",
        booking_id=booking_id,
        service_name=service_name,
        car_brand=car_brand,
        car_model=car_model,
        fuel_type="",
        booking_date=booking_date,
        booking_status=status,
        pickup_address=pickup_address,
        special_instructions=f"Status updated from {old_status} to {status}",
        estimated_cost=None
    )

async def send_daily_work_log_email(
    to_email: str,
    customer_name: str,
    date: str,
    work_done: str,
    parts_replaced: str,
    next_steps: str,
    booking_id: int,
    photos: list = None,
    videos: list = None
) -> bool:
    """
    Send daily work log email.
    """
    # Reuse booking email template for now as we don't have a specific log template
    message_lines = [
        f"Daily Work Log for {date}",
        f"Work Done: {work_done}",
    ]
    if parts_replaced and parts_replaced != "N/A":
        message_lines.append(f"Parts Replaced: {parts_replaced}")
    if next_steps and next_steps != "N/A":
        message_lines.append(f"Next Steps: {next_steps}")
        
    if photos:
        message_lines.append(f"{len(photos)} photos attached (view in dashboard)")
    if videos:
        message_lines.append(f"{len(videos)} videos attached (view in dashboard)")
        
    message = "\n".join(message_lines)
    
    return await email_service.send_booking_email(
        user_name=customer_name,
        user_email=to_email,
        user_phone="",
        booking_id=booking_id,
        service_name="Daily Work Log Update",
        car_brand="",
        car_model="",
        fuel_type="",
        booking_date=date, # Using log date as booking date for the template
        booking_status="In Progress",
        pickup_address="",
        special_instructions=message,
        estimated_cost=None
    )
