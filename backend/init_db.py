#!/usr/bin/env python3
"""
Database initialization script
Creates tables and optional demo users
"""
import sys
from database import engine, SessionLocal, init_db
from models import Base, User, UserRole
from auth import get_password_hash


def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")


def create_demo_users():
    """Create demo users for testing"""
    db = SessionLocal()

    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.username == "admin").first()
        if admin:
            print("⚠️  Demo users already exist. Skipping creation.")
            return

        # Create admin user
        admin_user = User(
            email="admin@performancehub.com",
            username="admin",
            full_name="System Administrator",
            organization="PerformanceHub",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN,
            avatar="👨‍💼"
        )
        db.add(admin_user)

        # Create regular user
        regular_user = User(
            email="user@performancehub.com",
            username="demo",
            full_name="Demo User",
            organization="Demo Corp",
            hashed_password=get_password_hash("demo123"),
            role=UserRole.USER,
            avatar="👤"
        )
        db.add(regular_user)

        # Create viewer user
        viewer_user = User(
            email="viewer@performancehub.com",
            username="viewer",
            full_name="Viewer User",
            organization="Demo Corp",
            hashed_password=get_password_hash("viewer123"),
            role=UserRole.VIEWER,
            avatar="👁️"
        )
        db.add(viewer_user)

        db.commit()
        print("✅ Demo users created successfully!")
        print("\n📋 Demo Credentials:")
        print("   Admin:  username=admin,  password=admin123")
        print("   User:   username=demo,   password=demo123")
        print("   Viewer: username=viewer, password=viewer123")
        print("\n⚠️  IMPORTANT: Change these passwords in production!")

    except Exception as e:
        print(f"❌ Error creating demo users: {e}")
        db.rollback()
    finally:
        db.close()


def main():
    """Main initialization function"""
    print("=" * 60)
    print("Performance Optimizer - Database Initialization")
    print("=" * 60)

    # Create tables
    create_tables()

    # Ask if user wants to create demo users
    response = input("\n📝 Create demo users for testing? (y/n): ").lower()
    if response == 'y':
        create_demo_users()
    else:
        print("⏭️  Skipping demo user creation.")

    print("\n✅ Database initialization complete!")
    print("🚀 You can now start the application with: uvicorn main:app --reload")


if __name__ == "__main__":
    main()