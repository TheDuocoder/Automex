FROM python:3.12-slim

WORKDIR /app

# Install system dependencies for MySQL
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY pyproject.toml ./

# Install Python dependencies using pip
# Note: aiomysql requires pymysql as a dependency
RUN pip install --no-cache-dir \
    pymysql>=1.0.0 \
    aiomysql>=0.2.0 \
    fastapi>=0.118.0 \
    "fastapi-users[sqlalchemy]>=14.0.1" \
    google-api-python-client>=2.186.0 \
    google-auth>=2.42.1 \
    google-auth-httplib2>=0.2.1 \
    google-auth-oauthlib>=1.2.2 \
    imagekitio>=4.2.0 \
    pydantic-settings>=2.11.0 \
    python-dotenv>=1.1.1 \
    "sqlalchemy[asyncio]>=2.0.0" \
    uvicorn[standard]>=0.37.0

# Copy application code
COPY . .

# Set PYTHONPATH to include src directory
ENV PYTHONPATH=/app/src:$PYTHONPATH

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "run.py"]

