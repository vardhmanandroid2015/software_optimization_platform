# ============================================================================
# main.py - FastAPI Application with Authentication
# ============================================================================
from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, Dict, List
from sqlalchemy.orm import Session
from datetime import timedelta
import asyncio
from datetime import datetime

from analyzer import CodeAnalyzer, DatabaseAnalyzer, AsyncAnalyzer
from hardware_monitor import HardwareMonitor
from network_analyzer import NetworkAnalyzer
from orchestration import ContainerOrchestrator
from monitoring import MetricsCollector, AlertManager
from database import get_db, settings, init_db
from models import User, UserRole
from auth import (
    get_password_hash,
    create_access_token,
    authenticate_user,
    get_current_active_user,
    get_admin_user
)
from schemas import UserCreate, UserResponse, Token, UserUpdate

app = FastAPI(title="Performance Optimization Platform", version="1.0.0")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()
    print("🚀 Application started successfully!")


# Initialize all monitors and analyzers
code_analyzer = CodeAnalyzer()
db_analyzer = DatabaseAnalyzer()
async_analyzer = AsyncAnalyzer()
hardware_monitor = HardwareMonitor()
network_analyzer = NetworkAnalyzer()
orchestrator = ContainerOrchestrator()
metrics_collector = MetricsCollector()
alert_manager = AlertManager()


# ============================================================================
# Models
# ============================================================================
class AnalysisRequest(BaseModel):
    target_path: Optional[str] = None
    database_config: Optional[Dict] = None
    deep_scan: bool = False


class OptimizationRequest(BaseModel):
    optimization_type: str
    target: str
    auto_apply: bool = False


# ============================================================================
# Authentication Endpoints
# ============================================================================
@app.post("/api/token", response_model=Token)
async def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
):
    """Login endpoint for obtaining JWT token"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/api/users/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # Check if email already exists
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        organization=user_data.organization,
        hashed_password=get_password_hash(user_data.password),
        role=user_data.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.get("/api/users/me", response_model=UserResponse)
async def get_current_user_info(
        current_user: User = Depends(get_current_active_user)
):
    """Get current user information"""
    return current_user


@app.put("/api/users/me", response_model=UserResponse)
async def update_current_user(
        user_update: UserUpdate,
        current_user: User = Depends(get_current_active_user),
        db: Session = Depends(get_db)
):
    """Update current user information"""
    if user_update.email is not None:
        current_user.email = user_update.email
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.organization is not None:
        current_user.organization = user_update.organization
    if user_update.avatar is not None:
        current_user.avatar = user_update.avatar

    current_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_user)

    return current_user


@app.get("/api/users", response_model=List[UserResponse])
async def list_users(
        admin_user: User = Depends(get_admin_user),
        db: Session = Depends(get_db)
):
    """List all users (admin only)"""
    users = db.query(User).all()
    return users


# ============================================================================
# Public Endpoints
# ============================================================================
@app.get("/")
async def root():
    return {"message": "Performance Optimization Platform API", "version": "1.0.0"}


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "analyzer": "running",
            "hardware_monitor": "running",
            "network_analyzer": "running",
            "orchestrator": "running"
        }
    }


# ============================================================================
# Protected Endpoints - Full System Analysis
# ============================================================================
@app.post("/api/analysis/full")
async def run_full_analysis(
        request: AnalysisRequest,
        background_tasks: BackgroundTasks,
        current_user: User = Depends(get_current_active_user)
):
    """Run comprehensive system analysis across all dimensions"""
    try:
        results = await asyncio.gather(
            code_analyzer.analyze_code_efficiency(request.target_path),
            db_analyzer.analyze_queries(),
            async_analyzer.detect_async_patterns(request.target_path),
            hardware_monitor.get_current_metrics(),
            network_analyzer.measure_performance(),
            orchestrator.get_container_health(),
            return_exceptions=True
        )

        software_results, db_results, async_results, hardware_results, network_results, container_results = results

        analysis_data = {
            "software": {
                "codeEfficiency": software_results.get("efficiency_score", 0),
                "dbOptimization": db_results.get("optimization_score", 0),
                "asyncProcessing": async_results.get("async_score", 0),
                "issues": software_results.get("issues_count", 0),
                "details": software_results
            },
            "hardware": {
                "cpuUtilization": hardware_results.get("cpu_percent", 0),
                "memoryUsage": hardware_results.get("memory_percent", 0),
                "diskPerformance": hardware_results.get("disk_score", 0),
                "recommendations": hardware_results.get("recommendations", []),
                "details": hardware_results
            },
            "network": {
                "latency": network_results.get("latency_ms", 0),
                "throughput": network_results.get("throughput_mbps", 0),
                "packetLoss": network_results.get("packet_loss", 0),
                "optimization": network_results.get("optimization_count", 0),
                "details": network_results
            },
            "io": {
                "diskIOPS": container_results.get("disk_iops_score", 0),
                "loadBalance": container_results.get("load_balance_score", 0),
                "containerHealth": container_results.get("health_score", 0),
                "alerts": container_results.get("alerts_count", 0),
                "details": container_results
            },
            "timestamp": datetime.now().isoformat(),
            "analyzed_by": current_user.username
        }

        background_tasks.add_task(metrics_collector.store_analysis, analysis_data)

        return analysis_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


# ============================================================================
# Software Optimization Endpoints (Protected)
# ============================================================================
@app.get("/api/software/profile")
async def get_code_profile(current_user: User = Depends(get_current_active_user)):
    """Get detailed code profiling results"""
    try:
        profile_data = await code_analyzer.profile_code()
        return {
            "functions": profile_data.get("hot_functions", []),
            "bottlenecks": profile_data.get("bottlenecks", []),
            "recommendations": profile_data.get("recommendations", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/software/database")
async def get_database_analysis(current_user: User = Depends(get_current_active_user)):
    """Analyze database queries and suggest optimizations"""
    try:
        db_data = await db_analyzer.analyze_queries()
        return {
            "slowQueries": db_data.get("slow_queries", []),
            "indexSuggestions": db_data.get("index_suggestions", []),
            "optimizations": db_data.get("optimizations", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/software/optimize")
async def apply_software_optimization(
        request: OptimizationRequest,
        current_user: User = Depends(get_current_active_user)
):
    """Apply specific software optimization"""
    try:
        result = await code_analyzer.apply_optimization(
            request.optimization_type,
            request.target,
            request.auto_apply
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Hardware Optimization Endpoints (Protected)
# ============================================================================
@app.get("/api/hardware/metrics")
async def get_hardware_metrics(current_user: User = Depends(get_current_active_user)):
    """Get current hardware utilization metrics"""
    try:
        metrics = await hardware_monitor.get_current_metrics()
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/hardware/history")
async def get_hardware_history(
        hours: int = 24,
        current_user: User = Depends(get_current_active_user)
):
    """Get historical hardware metrics"""
    try:
        history = await hardware_monitor.get_metrics_history(hours)
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/hardware/recommendations")
async def get_scaling_recommendations(current_user: User = Depends(get_current_active_user)):
    """Get hardware scaling recommendations"""
    try:
        recommendations = await hardware_monitor.get_scaling_recommendations()
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Network Optimization Endpoints (Protected)
# ============================================================================
@app.get("/api/network/performance")
async def get_network_performance(current_user: User = Depends(get_current_active_user)):
    """Get network performance metrics"""
    try:
        performance = await network_analyzer.measure_performance()
        return performance
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/network/regions")
async def get_regional_performance(current_user: User = Depends(get_current_active_user)):
    """Get performance by geographic region"""
    try:
        regions = await network_analyzer.analyze_regional_performance()
        return regions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/network/optimizations")
async def get_network_optimizations(current_user: User = Depends(get_current_active_user)):
    """Get network optimization suggestions"""
    try:
        optimizations = await network_analyzer.get_optimization_suggestions()
        return optimizations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# I/O & Infrastructure Endpoints (Protected)
# ============================================================================
@app.get("/api/infrastructure/containers")
async def get_container_status(current_user: User = Depends(get_current_active_user)):
    """Get status of all containers"""
    try:
        containers = await orchestrator.get_all_containers()
        return containers
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/infrastructure/load-balancer")
async def get_load_balancer_config(current_user: User = Depends(get_current_active_user)):
    """Get load balancer configuration"""
    try:
        config = await orchestrator.get_load_balancer_config()
        return config
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/infrastructure/scale")
async def scale_infrastructure(
        replicas: int,
        service: str,
        current_user: User = Depends(get_current_active_user)
):
    """Scale infrastructure components"""
    try:
        result = await orchestrator.scale_service(service, replicas)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Monitoring Endpoints (Protected)
# ============================================================================
@app.get("/api/monitoring/metrics")
async def get_real_time_metrics(current_user: User = Depends(get_current_active_user)):
    """Get real-time monitoring metrics"""
    try:
        metrics = await metrics_collector.get_current_metrics()
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/monitoring/alerts")
async def get_active_alerts(current_user: User = Depends(get_current_active_user)):
    """Get active system alerts"""
    try:
        alerts = await alert_manager.get_active_alerts()
        return alerts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/monitoring/history")
async def get_optimization_history(
        days: int = 7,
        current_user: User = Depends(get_current_active_user)
):
    """Get optimization history"""
    try:
        history = await metrics_collector.get_optimization_history(days)
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/monitoring/alert/dismiss")
async def dismiss_alert(
        alert_id: str,
        current_user: User = Depends(get_current_active_user)
):
    """Dismiss an alert"""
    try:
        result = await alert_manager.dismiss_alert(alert_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Auto-Optimization Endpoint (Protected)
# ============================================================================
@app.post("/api/optimize/auto")
async def auto_optimize(
        background_tasks: BackgroundTasks,
        current_user: User = Depends(get_current_active_user)
):
    """Automatically apply recommended optimizations"""
    try:
        background_tasks.add_task(run_auto_optimization)
        return {
            "status": "started",
            "message": "Auto-optimization process started in background"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def run_auto_optimization():
    """Background task for auto-optimization"""
    recommendations = await asyncio.gather(
        code_analyzer.get_recommendations(),
        db_analyzer.get_recommendations(),
        hardware_monitor.get_scaling_recommendations(),
        network_analyzer.get_optimization_suggestions()
    )

    for rec_list in recommendations:
        for rec in rec_list:
            if rec.get("safe_to_auto_apply", False):
                await apply_optimization(rec)


async def apply_optimization(recommendation: Dict):
    """Apply a single optimization"""
    opt_type = recommendation.get("type")

    if opt_type == "database_index":
        await db_analyzer.create_index(recommendation)
    elif opt_type == "cache_config":
        await code_analyzer.enable_caching(recommendation)
    elif opt_type == "container_scale":
        await orchestrator.scale_service(
            recommendation.get("service"),
            recommendation.get("replicas")
        )


# ============================================================================
# Export/Report Endpoint (Protected)
# ============================================================================
@app.get("/api/report/export")
async def export_report(
        format: str = "json",
        current_user: User = Depends(get_current_active_user)
):
    """Export comprehensive analysis report"""
    try:
        report_data = await asyncio.gather(
            code_analyzer.get_summary(),
            db_analyzer.get_summary(),
            hardware_monitor.get_summary(),
            network_analyzer.get_summary(),
            orchestrator.get_summary(),
            metrics_collector.get_summary()
        )

        report = {
            "generated_at": datetime.now().isoformat(),
            "generated_by": current_user.username,
            "software": report_data[0],
            "database": report_data[1],
            "hardware": report_data[2],
            "network": report_data[3],
            "infrastructure": report_data[4],
            "monitoring": report_data[5]
        }

        if format == "json":
            return report

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)