# 🎓 LearnSphere: National Education & Employment Analytics Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://python.org/)
[![Power BI](https://img.shields.io/badge/Power_BI-Desktop-F2C811?logo=powerbi&logoColor=black)](https://powerbi.microsoft.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An end-to-end, full-stack educational and employment intelligence platform developed as an academic college project. **LearnSphere** unifies macro national databases (**UDISE+** and **AISHE**) with primary empirical research (**National Student Survey**) into a single, high-performance interactive dashboard featuring embedded **Power BI Studio** simulations and a domain-specific **AI Chatbot**.

---

## 🌟 Key Highlights

- **1,305+ Cleansed Records**: Consolidated from 16 Excel worksheets across school, university, labor, and survey data into a single unified JSON schema.
- **Multi-Pillar Architecture**:
  1. 🏫 **School Education (UDISE+)**: State-wise schools, enrollment, teachers, PTR, GPI, and infrastructure metrics (water, electricity, girls' toilets, computers, internet).
  2. 🎓 **Higher Education (AISHE)**: College & university count, gross enrollment ratio (GER), gender parity, and faculty distribution.
  3. 💼 **Employment & Labor (PLFS)**: State-wise and national employment/unemployment rates with gender gap tracking.
  4. 👥 **Student Perspectives Survey (Primary Research)**: 105 verified student responses across 28 analytical indicators covering AI tool adoption, digital learning, and internship challenges.
- **Embedded Power BI Studio**: Interactive web simulation of all 5 report sheets from the project's native `Education landscape.pbix` file.
- **Intelligent AI Assistant**: Natural language querying over the entire 1,305-record database with English & Hinglish conversational support.
- **Automated ETL & Cleansing Lab**: Built-in data audit documenting null row removal, column normalization, and standardization steps.

---

## 📊 Empirical Data & Insights

| Dimension | Primary Metric | Insight |
| :--- | :--- | :--- |
| **School Ecosystem** | 14.7 Lakh Schools | ~24.8 Crore students enrolled nationwide (PTR 24:1). |
| **School Amenities** | 98.3% Water / 93.9% Toilets | Internet connectivity remains an opportunity area at 45.8%. |
| **Higher Education** | 47,757 Institutions | 4.32+ Crore students enrolled; National GER at 28.4%. |
| **Labor Participation** | 58.2% Employment / 3.2% Unemp | Significant gender participation delta (76.3% Male vs 40.1% Female). |
| **AI Adoption (Survey)** | 82.9% Regular Users | 63.8% strongly agree AI improves academic learning. |
| **Internship Deficit** | 56.2% Actively Seeking | 37.1% cite lack of practical/project-based skills as primary job hurdle. |

---

## 🛠️ Technology Stack

### Frontend & Visualizations
- **Framework**: React 18 with Vite for lightning-fast HMR and bundling.
- **Styling**: Tailwind CSS & Vanilla CSS with modern glassmorphism, fluid typography, and responsive design (desktop & mobile-first).
- **Charts & Graphics**: Recharts (Bar, Line, Pie, Area) & Lucide React icons.

### Data Engineering & Backend
- **Data Preprocessing**: Python 3 (`pandas`, `openpyxl`).
- **ETL Pipeline**: `clean_data.py` cleans raw Excel workbooks, handles multi-select tokenization, harmonizes state names, and exports to a unified `education_data.json`.
- **Database / Data Warehouse**: Normalized, structured single-file JSON repository (`src/data/education_data.json`).

### Business Intelligence & Deployment
- **Business Intelligence**: Power BI Desktop (`.pbix`) with DAX measures and interactive visualizations.
- **External Tunneling**: Cloudflare Tunnel integration for instant live client presentations.

---

## 📁 Project Structure

```bash
college_project/
├── learn-sphere-web/
│   ├── public/
│   │   ├── Education_landscape.pbix  # Original Power BI project file
│   │   └── logo.jpeg                 # Project branding asset
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx            # Sticky responsive navigation & year selector
│   │   │   ├── HeroSection.jsx       # Overview KPI metrics & national summary
│   │   │   ├── ThreePillarsRow.jsx   # Interactive 3-pillar gateway cards
│   │   │   ├── SchoolEducationView.jsx # UDISE+ schools, enrollment & infra charts
│   │   │   ├── HigherEducationView.jsx # AISHE universities, colleges & GER trends
│   │   │   ├── EmploymentView.jsx    # Employment/unemployment state comparison
│   │   │   ├── StudentPerspectivesView.jsx # 105 student survey analytics & explorer
│   │   │   ├── PowerBIDashboardView.jsx # 5-sheet embedded Power BI simulation
│   │   │   ├── StateComparisonView.jsx # Head-to-head state benchmark tool
│   │   │   ├── DataCleaningLab.jsx   # Automated ETL pipeline audit report
│   │   │   └── ChatbotWidget.jsx     # AI assistant with natural language engine
│   │   ├── data/
│   │   │   └── education_data.json   # 1,305 cleansed, consolidated records
│   │   ├── App.jsx                   # Central state controller
│   │   ├── main.jsx                  # React DOM entry point
│   │   └── index.css                 # Design tokens & responsive styles
│   ├── clean_data.py                 # Python automated ETL cleaning pipeline
│   ├── start_local.sh                # Local dev startup script (No Cloudflare)
│   ├── start.sh                      # Dual-launch script (Vite + Cloudflare tunnel)
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.x or higher) & `npm`
- **Python** (v3.10 or higher) with `pandas` and `openpyxl`

### 1. Installation
Clone the repository and install npm packages:
```bash
git clone https://github.com/<your-username>/learnsphere-analytics.git
cd learnsphere-analytics/learn-sphere-web
npm install
```

### 2. (Optional) Run Data Preprocessing Pipeline
To re-process and sanitize raw Excel sheets into the consolidated JSON:
```bash
python3 clean_data.py
```

### 3. Run Locally (No Cloudflare)
To start the application on your local network:
```bash
./start_local.sh
```
- Open your browser at: `http://localhost:5173`
- Or test on your mobile device using your local Wi-Fi IP (e.g., `http://192.168.x.x:5173`).

### 4. Run with Cloudflare Tunnel (For Remote Demos)
To share the live application with external mentors or clients:
```bash
./start.sh
```
The terminal will display the live public Cloudflare URL (e.g., `https://xxxx.trycloudflare.com`).

---

## 🤖 AI Chatbot Features

The built-in **LearnSphere AI Assistant** can answer complex queries directly from the data:
- *"Which state has the highest school enrollment?"*
- *"What is the Pupil-Teacher Ratio (PTR) in schools?"*
- *"What do students say about AI in education?"*
- *"Uttar Pradesh me kitne colleges aur schools hain?"*
- *"What is the primary obstacle students face in the job market?"*

---

## 📜 Academic Attribution & Sources

- **School Education**: Unified District Information System for Education Plus (**UDISE+**), Ministry of Education, Govt. of India.
- **Higher Education**: All India Survey on Higher Education (**AISHE**), Department of Higher Education, Govt. of India.
- **Employment Data**: Periodic Labour Force Survey (**PLFS**), MoSPI.
- **Primary Survey**: *Student Perspectives on the Changing Landscape of Education in India* (105 Verified Undergraduate & Postgraduate Respondents).

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
