from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app)

# Extracted Baseline Statistics from Images
BASELINE_STATS = {
    "idle": {
        "mean": 3.39864,
        "variance": 0.29737,
        "skewness": 2.48693,
        "kurtosis": 19.72604,
        "L2_dist": 3.58062,
        "perm_ent": 0.01266,
        "mean_power_w": 3.471
    },
    "browser": {
        "mean": 3.43461,
        "variance": 0.12784,
        "skewness": 1.44327,
        "kurtosis": 14.36355,
        "L2_dist": 3.70239,
        "perm_ent": 0.01307,
        "mean_power_w": 3.296
    },
    "registry": {
        "mean": 3.35519,
        "variance": 0.09683,
        "skewness": 0.70242,
        "kurtosis": 8.73144,
        "L2_dist": 3.91301,
        "perm_ent": 0.01299,
        "mean_power_w": 3.743
    }
}

# Training runs data (from images)
TRAINING_RUNS = [
    "run_02_clean_segments.pkl",
    "run_05_clean_segments.pkl",
    "run_06_clean_segments.pkl",
    "run_09_clean_segments.pkl",
    "run_10_clean_segments.pkl",
    "run_12_clean_segments.pkl",
    "run_13_clean_segments.pkl",
    "run_14_clean_segments.pkl",
]

TESTING_RUNS = [
    "run_18_clean_segments.pkl",
    "run_19_clean_segments.pkl",
]

# Vote distribution from baseline builder
VOTE_DISTRIBUTION = {
    "counts": [6, 13, 0, 10, 1, 0, 3, 1],
    "mean": 4.25,
    "std": 4.63,
    "threshold": 8.88,
    "infected_runs": 2
}


def generate_power_timeseries(duration_seconds=590, sampling_rate=100):
    """Generate simulated power consumption time series"""
    samples = int(duration_seconds * sampling_rate)
    timestamps = []
    power_values = []
    tasks = []
    
    base_time = datetime.now() - timedelta(seconds=duration_seconds)
    
    # Define task segments similar to the image
    task_segments = [
        {"start": 0, "end": 425, "task": "idle", "base_power": 3.471},
        {"start": 425, "end": 500, "task": "browser", "base_power": 3.296},
        {"start": 500, "end": 525, "task": "registry", "base_power": 3.743},
        {"start": 525, "end": 590, "task": "idle", "base_power": 3.471},
    ]
    
    for i in range(samples):
        current_time = base_time + timedelta(seconds=i / sampling_rate)
        timestamps.append(current_time.isoformat())
        
        # Determine current task
        current_second = (i / sampling_rate)
        current_task = "idle"
        base_power = 3.471
        
        for segment in task_segments:
            if segment["start"] <= current_second < segment["end"]:
                current_task = segment["task"]
                base_power = segment["base_power"]
                break
        
        # Add noise to power reading
        power = base_power + random.gauss(0, 0.1)
        power = max(0, power)  # Ensure non-negative
        
        power_values.append(round(power, 4))
        tasks.append(current_task)
    
    return {
        "timestamps": timestamps,
        "power_values": power_values,
        "tasks": tasks,
        "total_samples": samples,
        "duration_seconds": duration_seconds,
        "sampling_rate": sampling_rate
    }


def generate_power_distribution():
    """Generate power distribution data for each task"""
    return {
        "idle": {
            "mean": 3.471,
            "std": 0.545,
            "samples": 412,
            "distribution": [
                {"power_range": "2.8-3.0", "count": 20},
                {"power_range": "3.0-3.2", "count": 95},
                {"power_range": "3.2-3.4", "count": 145},
                {"power_range": "3.4-3.6", "count": 120},
                {"power_range": "3.6-3.8", "count": 32},
            ]
        },
        "browser": {
            "mean": 3.296,
            "std": 0.378,
            "samples": 75,
            "distribution": [
                {"power_range": "2.8-3.0", "count": 15},
                {"power_range": "3.0-3.2", "count": 28},
                {"power_range": "3.2-3.4", "count": 22},
                {"power_range": "3.4-3.6", "count": 10},
            ]
        },
        "registry": {
            "mean": 3.743,
            "std": 0.612,
            "samples": 25,
            "distribution": [
                {"power_range": "3.0-3.2", "count": 3},
                {"power_range": "3.2-3.4", "count": 7},
                {"power_range": "3.4-3.6", "count": 10},
                {"power_range": "3.6-3.8", "count": 5},
            ]
        }
    }


# API Endpoints

@app.route('/api/baseline', methods=['GET'])
def get_baseline():
    """Get baseline statistics for all tasks"""
    return jsonify(BASELINE_STATS)


@app.route('/api/baseline/<task>', methods=['GET'])
def get_baseline_task(task):
    """Get baseline statistics for a specific task"""
    if task not in BASELINE_STATS:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(BASELINE_STATS[task])


@app.route('/api/timeseries', methods=['GET'])
def get_timeseries():
    """Get power consumption time series data"""
    return jsonify(generate_power_timeseries())


@app.route('/api/power-distribution', methods=['GET'])
def get_power_distribution():
    """Get power distribution data for each task"""
    return jsonify(generate_power_distribution())


@app.route('/api/training-runs', methods=['GET'])
def get_training_runs():
    """Get list of training runs"""
    return jsonify({
        "training_files": TRAINING_RUNS,
        "testing_files": TESTING_RUNS,
        "total_training": len(TRAINING_RUNS),
        "total_testing": len(TESTING_RUNS)
    })


@app.route('/api/vote-distribution', methods=['GET'])
def get_vote_distribution():
    """Get vote distribution and infection detection results"""
    return jsonify(VOTE_DISTRIBUTION)


@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    """Get complete dashboard data"""
    return jsonify({
        "baseline": BASELINE_STATS,
        "timeseries": generate_power_timeseries(),
        "power_distribution": generate_power_distribution(),
        "training_runs": {
            "training": TRAINING_RUNS,
            "testing": TESTING_RUNS,
            "total_training": len(TRAINING_RUNS),
            "total_testing": len(TESTING_RUNS)
        },
        "vote_distribution": VOTE_DISTRIBUTION,
        "sampling_info": {
            "sampling_rate_hz": 100,
            "total_samples": 58746,
            "duration_seconds": 590.35,
            "actual_rate_hz": 99.5
        }
    })


@app.route('/api/kpi', methods=['GET'])
def get_kpi():
    """Get KPI metrics for dashboard"""
    return jsonify({
        "avg_power_w": 3.503,
        "peak_power_w": 6.2,
        "infected_runs": 2,
        "total_runs": 10,
        "anomaly_threshold": 8.88,
        "data_points_collected": 58746
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)
