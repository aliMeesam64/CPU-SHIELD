# CPU Shield

## AI-Based Malware Detection Using CPU Power Consumption Analysis

CPU Shield is an AI-powered malware detection framework that identifies malicious activities by analyzing CPU power consumption patterns and process behavior. Unlike traditional signature-based antivirus solutions, CPU Shield utilizes side-channel power analysis and machine learning techniques to detect both known and unknown malware, including zero-day attacks and stealthy threats.

---

## Project Overview

Modern malware such as rootkits, cryptocurrency miners, and polymorphic malware can evade traditional detection methods. CPU Shield introduces a hardware-assisted approach that monitors CPU power consumption externally using sensors connected to a Raspberry Pi.

The system collects power consumption data, CPU utilization metrics, and process behavior information. Machine learning models analyze these features to classify system activity as:

* Benign
* Suspicious
* Malicious

This approach provides an additional layer of defense that is difficult for malware to bypass because monitoring occurs outside the target operating system.

---

## Features

* Real-time CPU power monitoring
* External hardware-based malware detection
* Process behavior monitoring
* Feature extraction and preprocessing
* Machine learning-based classification
* Real-time dashboard visualization
* Alert generation for suspicious activities
* Historical data logging and storage
* Support for future integration with advanced AI models

---

## System Architecture

```text
┌───────────────────────┐
│   Target Computer     │
│ (CPU Power Rail 12V)  │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│    ACS712 Sensor      │
│ Current Measurement   │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│     ADS1115 ADC       │
│ Analog to Digital     │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│    Raspberry Pi       │
│ Data Acquisition      │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│ Data Processing Layer │
│ Feature Engineering   │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│ Machine Learning      │
│ Malware Detection     │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│ Dashboard & Alerts    │
└───────────────────────┘
```

---

## Hardware Requirements

| Component                             | Purpose                      |
| ------------------------------------- | ---------------------------- |
| Raspberry Pi 3B+ / 4B                 | Data acquisition             |
| ACS712 Current Sensor                 | Current measurement          |
| ADS1115 ADC Module                    | Analog-to-digital conversion |
| HP Compaq Pro 6300 (or any target PC) | Monitoring target            |
| ATX Power Supply                      | CPU power source             |
| Ethernet/WiFi                         | Communication                |

---

## Software Requirements

| Software             | Purpose                       |
| -------------------- | ----------------------------- |
| Raspberry Pi OS Lite | Raspberry Pi Operating System |
| Python 3.x           | Development                   |
| Pandas               | Data Processing               |
| NumPy                | Numerical Computation         |
| Scikit-Learn         | Machine Learning              |
| Streamlit            | Dashboard                     |
| Matplotlib           | Visualization                 |
| Kali Linux           | Development Environment       |

---

## Installation

### Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### Enable I2C

```bash
sudo raspi-config
```

Navigate to:

```text
Interface Options
 └── I2C
      └── Enable
```

### Install Required Packages

```bash
sudo apt install i2c-tools python3-pip python3-smbus -y
```

### Install Python Dependencies

```bash
pip install pandas
pip install numpy
pip install matplotlib
pip install scikit-learn
pip install streamlit
pip install adafruit-circuitpython-ads1x15
pip install psutil
```

---

## Hardware Connections

### ACS712 Sensor

| ACS712 Pin | Connection       |
| ---------- | ---------------- |
| VCC        | Raspberry Pi 5V  |
| GND        | Raspberry Pi GND |
| OUT        | ADS1115 A0       |

### ADS1115 Module

| ADS1115 Pin | Raspberry Pi Pin |
| ----------- | ---------------- |
| VDD         | 3.3V             |
| GND         | GND              |
| SDA         | GPIO2            |
| SCL         | GPIO3            |
| ADDR        | GND              |

---

## Data Collection

The system collects:

### Power Consumption Data

* Current (ACS712)
* Voltage (12V CPU Rail)
* Power Consumption

Power calculation:

```text
Power = Voltage × Current
```

### CPU Metrics

* CPU Usage %
* Active Processes
* Thread Count
* Resource Utilization

### Process Information

* Process Name
* Process ID (PID)
* Memory Usage
* CPU Usage
* Execution Time

---

## Data Preprocessing

The collected data undergoes:

### Noise Removal

* Moving Average Filtering

### Missing Value Handling

* Mean Imputation
* Forward Fill

### Normalization

* Min-Max Scaling

### Feature Extraction

* Mean Power
* Maximum Power
* Minimum Power
* Variance
* Standard Deviation
* CPU Utilization Average
* Resource Consumption Rate

---

## Machine Learning Models

The following algorithms can be used:

### Random Forest

Primary malware classification model.

### Support Vector Machine (SVM)

Binary classification and anomaly detection.

### Decision Tree

Interpretable malware detection.

### Ensemble Learning

Improved prediction accuracy.

---

## Dataset Categories

### Normal Activities

* Web Browsing
* Document Editing
* Video Playback
* System Idle

### Malware Activities

* Trojan Samples
* Cryptocurrency Miners
* Rootkit Simulations
* Resource-Intensive Malware

---

## Dashboard Features

The Streamlit dashboard provides:

* Live Power Monitoring
* CPU Utilization Tracking
* Malware Classification Results
* Alert Notifications
* Historical Data Analysis
* Interactive Visualizations

Run dashboard:

```bash
streamlit run app.py
```

---

## Project Structure

```text
CPU-Shield/
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── logs/
│
├── hardware/
│   ├── sensor_reader.py
│   └── adc_interface.py
│
├── preprocessing/
│   ├── cleaning.py
│   ├── normalization.py
│   └── feature_extraction.py
│
├── models/
│   ├── train.py
│   ├── predict.py
│   └── saved_models/
│
├── dashboard/
│   └── app.py
│
├── datasets/
│
├── requirements.txt
│
├── README.md
│
└── LICENSE
```

---

## Security Features

### Confidentiality

* Password-protected Raspberry Pi
* Restricted SSH access
* Local data storage

### Integrity

* Timestamped data collection
* Sensor validation
* Error handling

### Availability

* Lightweight architecture
* Continuous monitoring
* Automatic logging

---

## Test Cases

| Test Case | Description                  | Status      |
| --------- | ---------------------------- | ----------- |
| TC01      | Normal Activity Detection    | Passed      |
| TC02      | High CPU Load Detection      | Passed      |
| TC03      | Malware Simulation Detection | Pending     |
| TC04      | Dashboard Monitoring         | In Progress |

---

## Advantages

* Detects unknown malware
* Resistant to signature evasion
* Hardware-assisted monitoring
* Cost-effective implementation
* Real-time analysis
* Suitable for academic research

---

## Limitations

* Sensor noise may affect accuracy
* Requires physical hardware installation
* Limited training datasets
* Potential false positives
* Difficult detection of low-power malware

---

## Future Enhancements

* Deep Learning (CNN, LSTM, Autoencoders)
* Larger malware datasets
* Multi-feature detection framework
* Cloud-based monitoring
* Threat intelligence integration
* Industrial-scale deployment
* Advanced visualization and analytics

---

## Research Contribution

CPU Shield demonstrates that CPU power consumption and process behavior can be leveraged as reliable indicators of malicious activity. By combining hardware-level monitoring with artificial intelligence, the project introduces a novel and practical approach to malware detection.

---

## Authors

* Samran Abbas (44816)
* Muhammad Ali Meesam (45289)
* Muhammad Hasnain (44315)

### Supervisor

Dr. Muhammad Mansoor Alam

Faculty of Computing

Riphah International University, Islamabad

---

## License

This project is developed for academic and research purposes. Feel free to modify and extend it for educational use.
