"""Add latitude and longitude to pickup_request

Revision ID: add_location_coords
Revises: 
Create Date: 2025-11-29

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_location_coords'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add latitude and longitude columns to pickup_request table
    op.add_column('pickup_request', sa.Column('latitude', sa.Float(), nullable=True))
    op.add_column('pickup_request', sa.Column('longitude', sa.Float(), nullable=True))


def downgrade():
    # Remove latitude and longitude columns from pickup_request table
    op.drop_column('pickup_request', 'longitude')
    op.drop_column('pickup_request', 'latitude')
