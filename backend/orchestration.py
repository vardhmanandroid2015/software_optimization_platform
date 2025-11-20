# ============================================================================
# orchestration.py - Container and Infrastructure Orchestration
# ============================================================================
import asyncio
from typing import Dict, List, Optional
from datetime import datetime
import random

class ContainerOrchestrator:
    """Manages container orchestration and infrastructure optimization"""
    
    def __init__(self):
        self.containers = self._initialize_containers()
        self.load_balancer_config = self._initialize_load_balancer()
        
    def _initialize_containers(self) -> List[Dict]:
        """Initialize container state"""
        return [
            {
                "name": "api-service",
                "replicas": {"current": 3, "desired": 3},
                "cpu_percent": 45,
                "memory_percent": 62,
                "status": "healthy",
                "restarts": 0,
                "uptime_hours": 120
            },
            {
                "name": "worker-queue",
                "replicas": {"current": 5, "desired": 5},
                "cpu_percent": 72,
                "memory_percent": 58,
                "status": "healthy",
                "restarts": 1,
                "uptime_hours": 96
            },
            {
                "name": "database-primary",
                "replicas": {"current": 1, "desired": 1},
                "cpu_percent": 68,
                "memory_percent": 81,
                "status": "warning",
                "restarts": 0,
                "uptime_hours": 240
            },
            {
                "name": "cache-redis",
                "replicas": {"current": 2, "desired": 2},
                "cpu_percent": 32,
                "memory_percent": 45,
                "status": "healthy",
                "restarts": 0,
                "uptime_hours": 180
            }
        ]
    
    def _initialize_load_balancer(self) -> Dict:
        """Initialize load balancer configuration"""
        return {
            "algorithm": "round_robin",
            "health_check_interval": 10,
            "health_check_timeout": 5,
            "backends": [
                {"id": "backend-1", "status": "healthy", "connections": 45},
                {"id": "backend-2", "status": "healthy", "connections": 52},
                {"id": "backend-3", "status": "healthy", "connections": 38}
            ],
            "total_connections": 135,
            "requests_per_second": 234
        }
    
    async def get_container_health(self) -> Dict:
        """Get overall container health metrics"""
        try:
            containers = await self.get_all_containers()
            
            total_containers = len(containers)
            healthy_count = sum(1 for c in containers if c["status"] == "healthy")
            warning_count = sum(1 for c in containers if c["status"] == "warning")
            critical_count = sum(1 for c in containers if c["status"] == "critical")
            
            # Calculate health score
            health_score = (healthy_count / total_containers) * 100 if total_containers > 0 else 0
            
            # Calculate disk IOPS score (simulated)
            disk_iops_score = random.uniform(80, 95)
            
            # Calculate load balance score
            load_balance_score = await self._calculate_load_balance_score()
            
            # Count alerts
            alerts = []
            for container in containers:
                if container["status"] == "warning":
                    alerts.append({
                        "severity": "warning",
                        "container": container["name"],
                        "message": f"High resource usage on {container['name']}"
                    })
                elif container["status"] == "critical":
                    alerts.append({
                        "severity": "critical",
                        "container": container["name"],
                        "message": f"Critical state in {container['name']}"
                    })
            
            return {
                "health_score": round(health_score, 2),
                "disk_iops_score": round(disk_iops_score, 2),
                "load_balance_score": round(load_balance_score, 2),
                "alerts_count": len(alerts),
                "total_containers": total_containers,
                "healthy": healthy_count,
                "warning": warning_count,
                "critical": critical_count,
                "alerts": alerts,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "health_score": 95,
                "disk_iops_score": 85,
                "load_balance_score": 90,
                "alerts_count": 3,
                "error": str(e)
            }
    
    async def _calculate_load_balance_score(self) -> float:
        """Calculate load balancing efficiency score"""
        lb_config = await self.get_load_balancer_config()
        backends = lb_config.get("backends", [])
        
        if not backends:
            return 0.0
        
        # Calculate variance in connections
        connections = [b["connections"] for b in backends]
        avg_connections = sum(connections) / len(connections)
        variance = sum((c - avg_connections) ** 2 for c in connections) / len(connections)
        
        # Lower variance = better load balancing
        # Score from 0-100 (100 = perfect balance)
        score = max(0, 100 - (variance / avg_connections * 10)) if avg_connections > 0 else 100
        
        return score
    
    async def get_all_containers(self) -> List[Dict]:
        """Get status of all containers"""
        # Add some randomization to simulate real-time changes
        containers_data = []
        for container in self.containers:
            container_copy = container.copy()
            container_copy["cpu_percent"] += random.uniform(-5, 5)
            container_copy["memory_percent"] += random.uniform(-3, 3)
            
            # Ensure values are within bounds
            container_copy["cpu_percent"] = max(0, min(100, container_copy["cpu_percent"]))
            container_copy["memory_percent"] = max(0, min(100, container_copy["memory_percent"]))
            
            containers_data.append(container_copy)
        
        return containers_data
    
    async def get_load_balancer_config(self) -> Dict:
        """Get current load balancer configuration"""
        # Add real-time metrics
        config = self.load_balancer_config.copy()
        config["requests_per_second"] += random.randint(-20, 30)
        config["total_connections"] += random.randint(-10, 15)
        
        return config
    
    async def scale_service(self, service_name: str, replicas: int) -> Dict:
        """Scale a service to specified number of replicas"""
        try:
            # Find the service
            for container in self.containers:
                if container["name"] == service_name:
                    old_replicas = container["replicas"]["current"]
                    container["replicas"]["desired"] = replicas
                    
                    # Simulate scaling
                    await asyncio.sleep(1)
                    container["replicas"]["current"] = replicas
                    
                    return {
                        "status": "success",
                        "service": service_name,
                        "old_replicas": old_replicas,
                        "new_replicas": replicas,
                        "message": f"Scaled {service_name} from {old_replicas} to {replicas} replicas"
                    }
            
            return {
                "status": "error",
                "message": f"Service {service_name} not found"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
    
    async def update_load_balancer(self, algorithm: str) -> Dict:
        """Update load balancer algorithm"""
        valid_algorithms = ["round_robin", "least_connections", "ip_hash", "weighted"]
        
        if algorithm not in valid_algorithms:
            return {
                "status": "error",
                "message": f"Invalid algorithm. Must be one of: {valid_algorithms}"
            }
        
        old_algorithm = self.load_balancer_config["algorithm"]
        self.load_balancer_config["algorithm"] = algorithm
        
        return {
            "status": "success",
            "old_algorithm": old_algorithm,
            "new_algorithm": algorithm,
            "message": f"Load balancer algorithm changed to {algorithm}"
        }
    
    async def get_resource_limits(self) -> Dict:
        """Get resource limits for all containers"""
        limits = []
        
        for container in self.containers:
            limits.append({
                "name": container["name"],
                "cpu_limit": "1000m",
                "memory_limit": "2Gi",
                "cpu_request": "500m",
                "memory_request": "1Gi",
                "has_limits": True
            })
        
        return {
            "containers": limits,
            "containers_without_limits": 0,
            "recommendation": "All containers have resource limits defined"
        }
    
    async def analyze_container_efficiency(self) -> Dict:
        """Analyze container resource efficiency"""
        containers = await self.get_all_containers()
        
        inefficient = []
        for container in containers:
            # Check if resources are underutilized
            if container["cpu_percent"] < 20 and container["memory_percent"] < 30:
                inefficient.append({
                    "name": container["name"],
                    "issue": "Underutilized",
                    "cpu_usage": container["cpu_percent"],
                    "memory_usage": container["memory_percent"],
                    "recommendation": "Consider reducing resource allocation"
                })
            # Check if resources are overutilized
            elif container["cpu_percent"] > 80 or container["memory_percent"] > 80:
                inefficient.append({
                    "name": container["name"],
                    "issue": "Overutilized",
                    "cpu_usage": container["cpu_percent"],
                    "memory_usage": container["memory_percent"],
                    "recommendation": "Consider increasing resource allocation or scaling"
                })
        
        return {
            "total_containers": len(containers),
            "inefficient_containers": len(inefficient),
            "details": inefficient,
            "overall_efficiency": max(0, 100 - (len(inefficient) / len(containers) * 50))
        }
    
    async def get_disk_io_metrics(self) -> Dict:
        """Get disk I/O metrics"""
        return {
            "read_iops": random.randint(800, 1200),
            "write_iops": random.randint(400, 800),
            "read_throughput_mb": random.uniform(50, 150),
            "write_throughput_mb": random.uniform(25, 75),
            "latency_ms": random.uniform(1, 5),
            "queue_depth": random.randint(4, 12),
            "utilization_percent": random.uniform(40, 70)
        }
    
    async def get_auto_scaling_config(self) -> Dict:
        """Get auto-scaling configuration"""
        return {
            "enabled": True,
            "min_replicas": 2,
            "max_replicas": 10,
            "target_cpu_percent": 70,
            "target_memory_percent": 80,
            "scale_up_threshold": 5,  # minutes
            "scale_down_threshold": 15  # minutes
        }
    
    async def get_summary(self) -> Dict:
        """Get infrastructure summary"""
        health = await self.get_container_health()
        return {
            "total_containers": health["total_containers"],
            "healthy_containers": health["healthy"],
            "health_score": health["health_score"],
            "active_alerts": health["alerts_count"]
        }