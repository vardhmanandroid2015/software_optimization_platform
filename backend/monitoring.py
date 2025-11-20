# ============================================================================
# monitoring.py - Monitoring and Continuous Improvement
# ============================================================================
import asyncio
from typing import Dict, List
from datetime import datetime, timedelta
import random
import uuid

class MetricsCollector:
    """Collects and stores system metrics for monitoring"""
    
    def __init__(self):
        self.metrics_store = []
        self.optimization_history = []
        
    async def get_current_metrics(self) -> Dict:
        """Get current real-time metrics"""
        return {
            "requests_per_minute": random.randint(1000, 1500),
            "uptime_percent": round(random.uniform(99.5, 99.99), 2),
            "avg_response_time_ms": random.randint(100, 200),
            "error_rate_percent": round(random.uniform(0.01, 0.05), 2),
            "active_connections": random.randint(450, 650),
            "throughput_mbps": round(random.uniform(80, 120), 1),
            "cache_hit_rate": round(random.uniform(75, 95), 1),
            "database_queries_per_sec": random.randint(200, 400),
            "timestamp": datetime.now().isoformat()
        }
    
    async def store_analysis(self, analysis_data: Dict):
        """Store analysis results for historical tracking"""
        self.metrics_store.append({
            "timestamp": datetime.now().isoformat(),
            "data": analysis_data
        })
        
        # Keep only last 1000 entries
        if len(self.metrics_store) > 1000:
            self.metrics_store.pop(0)
    
    async def get_metrics_history(self, hours: int = 24) -> List[Dict]:
        """Get historical metrics"""
        # Generate mock historical data
        history = []
        now = datetime.now()
        
        for i in range(hours * 12):  # Every 5 minutes
            timestamp = now - timedelta(minutes=(hours * 60) - (i * 5))
            history.append({
                "timestamp": timestamp.isoformat(),
                "requests_per_minute": random.randint(800, 1500),
                "avg_response_time_ms": random.randint(100, 250),
                "error_rate_percent": round(random.uniform(0.01, 0.1), 3),
                "cpu_percent": random.uniform(50, 80),
                "memory_percent": random.uniform(60, 85)
            })
        
        return history
    
    async def get_optimization_history(self, days: int = 7) -> List[Dict]:
        """Get history of optimizations applied"""
        # Mock optimization history
        optimizations = [
            {
                "id": str(uuid.uuid4()),
                "date": (datetime.now() - timedelta(days=0)).strftime("%Y-%m-%d"),
                "action": "Enabled query caching",
                "impact": "-45% DB load",
                "status": "success",
                "applied_by": "auto-optimizer",
                "metrics_before": {"db_load": 85},
                "metrics_after": {"db_load": 47}
            },
            {
                "id": str(uuid.uuid4()),
                "date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
                "action": "Scaled to 4 instances",
                "impact": "+100% capacity",
                "status": "success",
                "applied_by": "admin",
                "metrics_before": {"instances": 2},
                "metrics_after": {"instances": 4}
            },
            {
                "id": str(uuid.uuid4()),
                "date": (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"),
                "action": "Optimized image processing",
                "impact": "-60% processing time",
                "status": "success",
                "applied_by": "auto-optimizer",
                "metrics_before": {"avg_time_ms": 567},
                "metrics_after": {"avg_time_ms": 227}
            },
            {
                "id": str(uuid.uuid4()),
                "date": (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d"),
                "action": "Added database indexes",
                "impact": "+45% query speed",
                "status": "success",
                "applied_by": "auto-optimizer",
                "metrics_before": {"query_time_ms": 2300},
                "metrics_after": {"query_time_ms": 1265}
            },
            {
                "id": str(uuid.uuid4()),
                "date": (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d"),
                "action": "Enabled HTTP/2",
                "impact": "+40% request efficiency",
                "status": "success",
                "applied_by": "admin",
                "metrics_before": {"requests_per_sec": 180},
                "metrics_after": {"requests_per_sec": 252}
            }
        ]
        
        # Filter by days
        cutoff_date = datetime.now() - timedelta(days=days)
        filtered = [
            opt for opt in optimizations
            if datetime.strptime(opt["date"], "%Y-%m-%d") >= cutoff_date
        ]
        
        return filtered
    
    async def get_performance_trends(self) -> Dict:
        """Get performance trends over time"""
        return {
            "response_time_trend": "improving",
            "response_time_change_percent": -12.5,
            "error_rate_trend": "stable",
            "error_rate_change_percent": -0.02,
            "throughput_trend": "improving",
            "throughput_change_percent": +15.3,
            "uptime_trend": "stable",
            "uptime_change_percent": +0.05,
            "period": "last_7_days"
        }
    
    async def get_summary(self) -> Dict:
        """Get monitoring summary"""
        metrics = await self.get_current_metrics()
        return {
            "uptime": metrics["uptime_percent"],
            "avg_response_time": metrics["avg_response_time_ms"],
            "error_rate": metrics["error_rate_percent"],
            "requests_per_minute": metrics["requests_per_minute"]
        }


class AlertManager:
    """Manages system alerts and notifications"""
    
    def __init__(self):
        self.active_alerts = self._initialize_alerts()
        
    def _initialize_alerts(self) -> List[Dict]:
        """Initialize sample alerts"""
        now = datetime.now()
        return [
            {
                "id": str(uuid.uuid4()),
                "severity": "warning",
                "title": "High Memory Usage",
                "description": "Memory usage has exceeded 80% threshold",
                "metric": "memory_percent",
                "current_value": 82.5,
                "threshold": 80,
                "time": (now - timedelta(minutes=2)).isoformat(),
                "status": "active",
                "acknowledged": False
            },
            {
                "id": str(uuid.uuid4()),
                "severity": "info",
                "title": "Scheduled Maintenance Window",
                "description": "System maintenance scheduled for tonight",
                "time": (now - timedelta(minutes=15)).isoformat(),
                "status": "active",
                "acknowledged": False
            },
            {
                "id": str(uuid.uuid4()),
                "severity": "warning",
                "title": "Slow Query Detected",
                "description": "Database query execution time exceeded 2 seconds",
                "metric": "query_time_ms",
                "current_value": 2350,
                "threshold": 2000,
                "time": (now - timedelta(hours=1)).isoformat(),
                "status": "active",
                "acknowledged": False
            }
        ]
    
    async def get_active_alerts(self) -> List[Dict]:
        """Get all active alerts"""
        return [alert for alert in self.active_alerts if alert["status"] == "active"]
    
    async def dismiss_alert(self, alert_id: str) -> Dict:
        """Dismiss an alert"""
        for alert in self.active_alerts:
            if alert["id"] == alert_id:
                alert["status"] = "dismissed"
                alert["acknowledged"] = True
                alert["dismissed_at"] = datetime.now().isoformat()
                
                return {
                    "status": "success",
                    "message": f"Alert {alert_id} dismissed",
                    "alert": alert
                }
        
        return {
            "status": "error",
            "message": f"Alert {alert_id} not found"
        }
    
    async def create_alert(self, severity: str, title: str, description: str, metric: str = None, current_value: float = None, threshold: float = None) -> Dict:
        """Create a new alert"""
        alert = {
            "id": str(uuid.uuid4()),
            "severity": severity,
            "title": title,
            "description": description,
            "time": datetime.now().isoformat(),
            "status": "active",
            "acknowledged": False
        }
        
        if metric:
            alert["metric"] = metric
            alert["current_value"] = current_value
            alert["threshold"] = threshold
        
        self.active_alerts.append(alert)
        
        return {
            "status": "success",
            "alert": alert
        }
    
    async def get_alert_statistics(self) -> Dict:
        """Get alert statistics"""
        total_alerts = len(self.active_alerts)
        active_alerts = len([a for a in self.active_alerts if a["status"] == "active"])
        
        by_severity = {
            "critical": len([a for a in self.active_alerts if a.get("severity") == "critical"]),
            "warning": len([a for a in self.active_alerts if a.get("severity") == "warning"]),
            "info": len([a for a in self.active_alerts if a.get("severity") == "info"])
        }
        
        return {
            "total_alerts": total_alerts,
            "active_alerts": active_alerts,
            "by_severity": by_severity,
            "alert_rate_per_hour": round(random.uniform(1, 5), 1)
        }
    
    async def check_thresholds(self, metrics: Dict) -> List[Dict]:
        """Check if any metrics exceed thresholds and create alerts"""
        new_alerts = []
        
        # Check CPU threshold
        if metrics.get("cpu_percent", 0) > 85:
            alert = await self.create_alert(
                severity="warning",
                title="High CPU Usage",
                description=f"CPU usage at {metrics['cpu_percent']:.1f}%",
                metric="cpu_percent",
                current_value=metrics["cpu_percent"],
                threshold=85
            )
            new_alerts.append(alert)
        
        # Check memory threshold
        if metrics.get("memory_percent", 0) > 85:
            alert = await self.create_alert(
                severity="warning",
                title="High Memory Usage",
                description=f"Memory usage at {metrics['memory_percent']:.1f}%",
                metric="memory_percent",
                current_value=metrics["memory_percent"],
                threshold=85
            )
            new_alerts.append(alert)
        
        # Check error rate
        if metrics.get("error_rate_percent", 0) > 1:
            alert = await self.create_alert(
                severity="critical",
                title="High Error Rate",
                description=f"Error rate at {metrics['error_rate_percent']:.2f}%",
                metric="error_rate_percent",
                current_value=metrics["error_rate_percent"],
                threshold=1
            )
            new_alerts.append(alert)
        
        return new_alerts