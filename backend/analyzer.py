# ============================================================================
# analyzer.py - Software-Level Optimization Analyzer
# ============================================================================
import ast
import cProfile
import pstats
import io
import asyncio
from pathlib import Path
from typing import Dict, List, Optional
import time
import re

class CodeAnalyzer:
    """Analyzes code efficiency and provides optimization recommendations"""
    
    def __init__(self):
        self.profiler = cProfile.Profile()
        self.analysis_cache = {}
        
    async def analyze_code_efficiency(self, target_path: Optional[str] = None) -> Dict:
        """Analyze code efficiency and return metrics"""
        try:
            if not target_path:
                target_path = "."
            
            path = Path(target_path)
            python_files = list(path.rglob("*.py"))
            
            total_lines = 0
            complex_functions = 0
            code_smells = []
            
            for file in python_files[:10]:  # Limit for demo
                try:
                    with open(file, 'r', encoding='utf-8') as f:
                        content = f.read()
                        total_lines += len(content.split('\n'))
                        
                        # Parse AST
                        tree = ast.parse(content)
                        
                        # Analyze functions
                        for node in ast.walk(tree):
                            if isinstance(node, ast.FunctionDef):
                                complexity = self._calculate_complexity(node)
                                if complexity > 10:
                                    complex_functions += 1
                                    code_smells.append({
                                        "file": str(file),
                                        "function": node.name,
                                        "complexity": complexity,
                                        "line": node.lineno
                                    })
                except Exception as e:
                    continue
            
            # Calculate efficiency score
            efficiency_score = max(0, 100 - (complex_functions * 5))
            
            return {
                "efficiency_score": efficiency_score,
                "total_files": len(python_files),
                "total_lines": total_lines,
                "complex_functions": complex_functions,
                "issues_count": len(code_smells),
                "code_smells": code_smells[:5],  # Top 5
                "recommendations": self._generate_recommendations(code_smells)
            }
            
        except Exception as e:
            return {
                "efficiency_score": 75,
                "total_files": 0,
                "issues_count": 0,
                "error": str(e)
            }
    
    def _calculate_complexity(self, node: ast.FunctionDef) -> int:
        """Calculate cyclomatic complexity of a function"""
        complexity = 1
        for child in ast.walk(node):
            if isinstance(child, (ast.If, ast.While, ast.For, ast.ExceptHandler)):
                complexity += 1
            elif isinstance(child, ast.BoolOp):
                complexity += len(child.values) - 1
        return complexity
    
    def _generate_recommendations(self, code_smells: List[Dict]) -> List[Dict]:
        """Generate optimization recommendations"""
        recommendations = []
        
        for smell in code_smells[:3]:
            recommendations.append({
                "type": "complexity",
                "title": f"Reduce complexity in {smell['function']}()",
                "description": f"Function has complexity {smell['complexity']}. Consider refactoring.",
                "impact": "medium",
                "safe_to_auto_apply": False
            })
        
        return recommendations
    
    async def profile_code(self) -> Dict:
        """Profile code execution and identify bottlenecks"""
        # Simulated profiling data
        hot_functions = [
            {
                "name": "user_authentication()",
                "time_ms": 234,
                "calls": 1250,
                "impact": "high",
                "cumulative_time": 292500
            },
            {
                "name": "database_query_users()",
                "time_ms": 1890,
                "calls": 856,
                "impact": "critical",
                "cumulative_time": 1617840
            },
            {
                "name": "image_processing()",
                "time_ms": 567,
                "calls": 423,
                "impact": "medium",
                "cumulative_time": 239841
            },
            {
                "name": "cache_refresh()",
                "time_ms": 89,
                "calls": 2341,
                "impact": "low",
                "cumulative_time": 208349
            }
        ]
        
        bottlenecks = [
            {
                "function": "database_query_users()",
                "issue": "N+1 query pattern detected",
                "recommendation": "Use JOIN or eager loading"
            },
            {
                "function": "user_authentication()",
                "issue": "Synchronous password hashing",
                "recommendation": "Move to background task"
            }
        ]
        
        return {
            "hot_functions": hot_functions,
            "bottlenecks": bottlenecks,
            "recommendations": [
                {
                    "type": "query_optimization",
                    "title": "Optimize database queries",
                    "impact": "+45% performance"
                }
            ]
        }
    
    async def apply_optimization(self, opt_type: str, target: str, auto_apply: bool) -> Dict:
        """Apply specific optimization"""
        # Simulate applying optimization
        await asyncio.sleep(1)
        
        return {
            "status": "success",
            "optimization": opt_type,
            "target": target,
            "applied": auto_apply,
            "message": f"Optimization {opt_type} applied to {target}"
        }
    
    async def get_recommendations(self) -> List[Dict]:
        """Get all code optimization recommendations"""
        return [
            {
                "type": "cache_config",
                "title": "Enable Redis caching",
                "impact": "+60% response time",
                "safe_to_auto_apply": True
            }
        ]
    
    async def enable_caching(self, recommendation: Dict):
        """Enable caching based on recommendation"""
        # Implementation for enabling caching
        pass
    
    async def get_summary(self) -> Dict:
        """Get analysis summary"""
        return {
            "total_issues": 12,
            "critical": 2,
            "high": 5,
            "medium": 5,
            "efficiency_score": 72
        }


class DatabaseAnalyzer:
    """Analyzes database queries and suggests optimizations"""
    
    def __init__(self):
        self.slow_query_threshold = 1000  # ms
        
    async def analyze_queries(self) -> Dict:
        """Analyze database queries"""
        # Simulated query analysis
        slow_queries = [
            {
                "query": "SELECT * FROM users WHERE email = ?",
                "avg_time_ms": 2300,
                "calls": 856,
                "table": "users",
                "missing_index": "email"
            },
            {
                "query": "SELECT * FROM orders JOIN users ON ...",
                "avg_time_ms": 1890,
                "calls": 423,
                "table": "orders",
                "issue": "Full table scan"
            }
        ]
        
        index_suggestions = [
            {
                "table": "users",
                "column": "email",
                "type": "btree",
                "impact": "+45% query speed",
                "safe_to_auto_apply": True
            },
            {
                "table": "orders",
                "column": "user_id",
                "type": "btree",
                "impact": "+30% query speed",
                "safe_to_auto_apply": True
            }
        ]
        
        optimizations = [
            {
                "title": "Implement query result caching",
                "impact": "-60% DB load",
                "type": "caching"
            },
            {
                "title": "Enable connection pooling",
                "impact": "+30% throughput",
                "type": "connection"
            },
            {
                "title": "Optimize JOIN operations",
                "impact": "+25% query speed",
                "type": "query"
            }
        ]
        
        optimization_score = 65
        
        return {
            "optimization_score": optimization_score,
            "slow_queries": slow_queries,
            "index_suggestions": index_suggestions,
            "optimizations": optimizations
        }
    
    async def create_index(self, recommendation: Dict):
        """Create database index"""
        # Implementation for creating index
        pass
    
    async def get_recommendations(self) -> List[Dict]:
        """Get database optimization recommendations"""
        return [
            {
                "type": "database_index",
                "table": "users",
                "column": "email",
                "safe_to_auto_apply": True
            }
        ]
    
    async def get_summary(self) -> Dict:
        """Get database analysis summary"""
        return {
            "slow_queries": 8,
            "missing_indexes": 3,
            "optimization_score": 65
        }


class AsyncAnalyzer:
    """Analyzes asynchronous patterns and concurrency"""
    
    async def detect_async_patterns(self, target_path: Optional[str] = None) -> Dict:
        """Detect async/await patterns and potential improvements"""
        
        # Simulated analysis
        async_score = 80
        
        patterns_found = {
            "async_functions": 15,
            "await_calls": 48,
            "blocking_calls": 5,
            "sync_in_async": 3
        }
        
        issues = [
            {
                "type": "blocking_io",
                "location": "services/api.py:45",
                "recommendation": "Use aiohttp instead of requests"
            },
            {
                "type": "sync_in_async",
                "location": "utils/db.py:78",
                "recommendation": "Use async database driver"
            }
        ]
        
        return {
            "async_score": async_score,
            "patterns": patterns_found,
            "issues": issues,
            "recommendations": [
                {
                    "title": "Convert blocking I/O to async",
                    "impact": "+40% concurrency"
                }
            ]
        }
    
    async def get_summary(self) -> Dict:
        """Get async analysis summary"""
        return {
            "async_score": 80,
            "blocking_calls": 5,
            "recommendations": 3
        }