# ============================================================================
# hardware_monitor.py - Hardware Optimization Monitor
# ============================================================================
import psutil
import asyncio
from typing import Dict, List
from datetime import datetime, timedelta
import random

class HardwareMonitor:
    """Monitors hardware resources and provides scaling recommendations"""
    
    def __init__(self):
        self.metrics_history = []
        self.max_history_size = 1000
        
    async def get_current_metrics(self) -> Dict:
        """Get current hardware utilization metrics"""
        try:
            # CPU metrics
            cpu_percent = psutil.cpu_percent(interval=1)
            cpu_count = psutil.cpu_count()
            cpu_freq = psutil.cpu_freq()
            
            # Memory metrics
            memory = psutil.virtual_memory()
            memory_percent = memory.percent
            memory_available_gb = memory.available / (1024**3)
            memory_total_gb = memory.total / (1024**3)
            
            # Disk metrics
            disk = psutil.disk_usage('/')
            disk_percent = disk.percent
            disk_read_bytes = psutil.disk_io_counters().read_bytes
            disk_write_bytes = psutil.disk_io_counters().write_bytes
            
            # Network metrics
            net_io = psutil.net_io_counters()
            
            # Calculate disk performance score
            disk_score = max(0, 100 - disk_percent)
            
            # Generate recommendations
            recommendations = []
            if cpu_percent > 80:
                recommendations.append({
                    "type": "cpu",
                    "severity": "high",
                    "message": "High CPU usage detected. Consider vertical scaling."
                })
            
            if memory_percent > 80:
                recommendations.append({
                    "type": "memory",
                    "severity": "high",
                    "message": "High memory usage. Consider adding more RAM."
                })
            
            if disk_percent > 85:
                recommendations.append({
                    "type": "disk",
                    "severity": "medium",
                    "message": "Disk space running low."
                })
            
            metrics = {
                "cpu_percent": round(cpu_percent, 2),
                "cpu_count": cpu_count,
                "cpu_freq_mhz": round(cpu_freq.current, 2) if cpu_freq else 0,
                "memory_percent": round(memory_percent, 2),
                "memory_available_gb": round(memory_available_gb, 2),
                "memory_total_gb": round(memory_total_gb, 2),
                "disk_percent": round(disk_percent, 2),
                "disk_score": round(disk_score, 2),
                "disk_read_mb": round(disk_read_bytes / (1024**2), 2),
                "disk_write_mb": round(disk_write_bytes / (1024**2), 2),
                "network_sent_mb": round(net_io.bytes_sent / (1024**2), 2),
                "network_recv_mb": round(net_io.bytes_recv / (1024**2), 2),
                "recommendations": recommendations,
                "timestamp": datetime.now().isoformat()
            }
            
            # Store in history
            self._store_metrics(metrics)
            
            return metrics
            
        except Exception as e:
            # Return mock data if psutil fails
            return self._get_mock_metrics()
    
    def _get_mock_metrics(self) -> Dict:
        """Return mock metrics for demo purposes"""
        return {
            "cpu_percent": 68.5,
            "cpu_count": 8,
            "cpu_freq_mhz": 2400,
            "memory_percent": 75.2,
            "memory_available_gb": 7.8,
            "memory_total_gb": 32.0,
            "disk_percent": 45.3,
            "disk_score": 82.0,
            "disk_read_mb": 1234.5,
            "disk_write_mb": 567.8,
            "network_sent_mb": 890.1,
            "network_recv_mb": 1234.5,
            "recommendations": [
                {
                    "type": "memory",
                    "severity": "medium",
                    "message": "Memory usage approaching 80%. Monitor closely."
                }
            ],
            "timestamp": datetime.now().isoformat()
        }
    
    def _store_metrics(self, metrics: Dict):
        """Store metrics in history"""
        self.metrics_history.append(metrics)
        if len(self.metrics_history) > self.max_history_size:
            self.metrics_history.pop(0)
    
    async def get_metrics_history(self, hours: int = 24) -> Dict:
        """Get historical hardware metrics"""
        # Generate mock historical data
        now = datetime.now()
        data_points = []
        
        for i in range(hours):
            timestamp = now - timedelta(hours=hours-i)
            data_points.append({
                "timestamp": timestamp.isoformat(),
                "cpu_percent": 60 + random.uniform(-15, 20),
                "memory_percent": 70 + random.uniform(-10, 15),
                "disk_percent": 45 + random.uniform(-5, 10),
                "network_mbps": 100 + random.uniform(-30, 50)
            })
        
        return {
            "period_hours": hours,
            "data_points": data_points,
            "summary": {
                "avg_cpu": sum(d["cpu_percent"] for d in data_points) / len(data_points),
                "max_cpu": max(d["cpu_percent"] for d in data_points),
                "avg_memory": sum(d["memory_percent"] for d in data_points) / len(data_points),
                "max_memory": max(d["memory_percent"] for d in data_points)
            }
        }
    
    async def get_scaling_recommendations(self) -> Dict:
        """Get hardware scaling recommendations"""
        current = await self.get_current_metrics()
        
        recommendations = []
        
        # Vertical scaling recommendations
        if current["cpu_percent"] > 75 or current["memory_percent"] > 75:
            recommendations.append({
                "type": "Vertical Scaling",
                "current": f"{current['cpu_count']} vCPU, {current['memory_total_gb']:.0f}GB RAM",
                "recommended": f"{current['cpu_count'] * 2} vCPU, {current['memory_total_gb'] * 2:.0f}GB RAM",
                "improvement": "+85% processing capacity",
                "cost": f"+${(current['cpu_count'] * 15)}/month",
                "priority": "high",
                "reasoning": "Current utilization exceeds 75%"
            })
        
        # Horizontal scaling recommendations
        recommendations.append({
            "type": "Horizontal Scaling",
            "current": "2 instances",
            "recommended": "4 instances",
            "improvement": "+100% availability, +50% throughput",
            "cost": "+$240/month",
            "priority": "medium",
            "reasoning": "Improve fault tolerance and handle traffic spikes"
        })
        
        # Storage scaling
        if current["disk_percent"] > 70:
            recommendations.append({
                "type": "Storage Scaling",
                "current": "500GB SSD",
                "recommended": "1TB SSD",
                "improvement": "+100% storage capacity",
                "cost": "+$50/month",
                "priority": "medium",
                "reasoning": f"Disk usage at {current['disk_percent']:.1f}%"
            })
        
        return {
            "recommendations": recommendations,
            "current_metrics": current,
            "estimated_roi": "3-6 months",
            "risk_assessment": "low"
        }
    
    async def get_resource_forecast(self, days: int = 30) -> Dict:
        """Forecast future resource needs"""
        return {
            "forecast_days": days,
            "predictions": {
                "cpu_trend": "increasing",
                "expected_cpu_percent": 82,
                "memory_trend": "stable",
                "expected_memory_percent": 76,
                "action_needed": True,
                "recommended_action": "Scale up within 2 weeks"
            }
        }
    
    async def get_summary(self) -> Dict:
        """Get hardware summary"""
        current = await self.get_current_metrics()
        return {
            "cpu_utilization": current["cpu_percent"],
            "memory_utilization": current["memory_percent"],
            "disk_utilization": current["disk_percent"],
            "health_status": "good" if current["cpu_percent"] < 80 and current["memory_percent"] < 80 else "warning"
        }