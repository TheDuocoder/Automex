"""
Test script to verify S3 connection and configuration
"""
import asyncio
from automex_backend.config import settings
from automex_backend.services.s3 import s3_service

def test_s3_config():
    """Test S3 configuration"""
    print("=" * 60)
    print("AWS S3 Configuration Test")
    print("=" * 60)
    
    print(f"\n✓ AWS Access Key ID: {settings.AWS_ACCESS_KEY_ID[:10]}..." if settings.AWS_ACCESS_KEY_ID else "✗ AWS Access Key ID: NOT SET")
    print(f"✓ AWS Secret Key: {'*' * 20}" if settings.AWS_SECRET_ACCESS_KEY else "✗ AWS Secret Key: NOT SET")
    print(f"✓ AWS Region: {settings.AWS_REGION}")
    print(f"✓ AWS Bucket: {settings.AWS_BUCKET_NAME}")
    print(f"✓ AWS Folder: {settings.AWS_S3_FOLDER}")
    
    print("\n" + "=" * 60)
    print("Testing S3 Connection...")
    print("=" * 60)
    
    try:
        # Try to list objects in the bucket (just to verify connection)
        response = s3_service.s3_client.list_objects_v2(
            Bucket=settings.AWS_BUCKET_NAME,
            Prefix=settings.AWS_S3_FOLDER,
            MaxKeys=5
        )
        
        print(f"\n✓ Successfully connected to S3 bucket: {settings.AWS_BUCKET_NAME}")
        print(f"✓ Folder '{settings.AWS_S3_FOLDER}' is accessible")
        
        if 'Contents' in response:
            print(f"✓ Found {len(response['Contents'])} existing files in folder")
            print("\nExisting files:")
            for obj in response['Contents'][:5]:
                print(f"  - {obj['Key']} ({obj['Size']} bytes)")
        else:
            print("✓ Folder is empty (ready for uploads)")
        
        print("\n" + "=" * 60)
        print("✅ S3 Configuration is VALID and WORKING!")
        print("=" * 60)
        return True
        
    except Exception as e:
        print(f"\n✗ Error connecting to S3: {str(e)}")
        print("\n" + "=" * 60)
        print("❌ S3 Configuration FAILED!")
        print("=" * 60)
        print("\nPossible issues:")
        print("1. Check AWS credentials are correct")
        print("2. Verify IAM permissions for the access key")
        print("3. Ensure bucket name and region are correct")
        print("4. Check network connectivity")
        return False

if __name__ == "__main__":
    test_s3_config()
