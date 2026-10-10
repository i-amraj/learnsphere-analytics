import pandas as pd
import json
import os
import shutil

# Resolve base directories
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if os.path.basename(CURRENT_DIR) == "learn-sphere-web":
    PROJECT_DIR = os.path.dirname(CURRENT_DIR)
    WEB_DIR = CURRENT_DIR
else:
    PROJECT_DIR = CURRENT_DIR
    WEB_DIR = os.path.join(CURRENT_DIR, "learn-sphere-web")

WEB_PUBLIC_DIR = os.path.join(WEB_DIR, "public")
WEB_SRC_DATA = os.path.join(WEB_DIR, "src", "data")

os.makedirs(WEB_PUBLIC_DIR, exist_ok=True)
os.makedirs(WEB_SRC_DATA, exist_ok=True)

# Copy logo if exists
for candidate in [
    os.path.join(PROJECT_DIR, "WhatsApp Image 2026-10-09 at 11.31.09 AM.jpeg"),
    os.path.join(WEB_DIR, "WhatsApp Image 2026-10-09 at 11.31.09 AM.jpeg")
]:
    if os.path.exists(candidate):
        shutil.copyfile(candidate, os.path.join(WEB_PUBLIC_DIR, "logo.jpeg"))
        print(f"Logo copied to {os.path.join(WEB_PUBLIC_DIR, 'logo.jpeg')}")
        break

def find_file(filename):
    """Find file in either WEB_DIR or PROJECT_DIR"""
    p1 = os.path.join(WEB_DIR, filename)
    if os.path.exists(p1):
        return p1
    p2 = os.path.join(PROJECT_DIR, filename)
    if os.path.exists(p2):
        return p2
    return None

def clean_sheet_data(filepath, sheet_name):
    if not filepath or not os.path.exists(filepath):
        print(f"Warning: File not found: {filepath}")
        return []
    df = pd.read_excel(filepath, sheet_name=sheet_name, header=None)
    headers = [str(x).strip() for x in df.iloc[2].values]
    data = df.iloc[3:].copy()
    data.columns = headers
    
    # Filter out columns with header 'nan' or empty or 'Unnamed'
    cols = [c for c in data.columns if c and c.lower() != 'nan' and not c.startswith('Unnamed')]
    data = data[cols]
    
    # Drop rows where 'Year' is NaN or null
    data = data.dropna(subset=['Year'])
    
    # Normalize year strings
    data['Year'] = data['Year'].astype(str).str.replace(' ', '').str.strip()
    
    # Normalize state/UT column name to standard 'State'
    for col in data.columns:
        if any(term in col.lower() for term in ['state', 'states/uts', 'state/uts']):
            data = data.rename(columns={col: 'State'})
            break
            
    # Clean numerical columns
    for col in data.columns:
        if col not in ['Year', 'State']:
            data[col] = pd.to_numeric(data[col], errors='coerce').fillna(0)
            
    return data.to_dict(orient='records')

def parse_multi_select(series):
    """Counts individual tokens in multi-select survey questions"""
    counts = {}
    for val in series.dropna():
        items = [i.strip() for i in str(val).split(',') if i.strip()]
        for it in items:
            counts[it] = counts.get(it, 0) + 1
    sorted_items = sorted(counts.items(), key=lambda x: x[1], reverse=True)
    return [{"name": k, "count": v, "percentage": round((v / len(series)) * 100, 1)} for k, v in sorted_items]

def parse_single_select(series):
    """Counts single select survey questions"""
    vc = series.dropna().value_counts()
    total = len(series)
    return [{"name": str(k).strip(), "count": int(v), "percentage": round((v / total) * 100, 1)} for k, v in vc.items()]

def clean_student_survey_data(filepath):
    if not filepath or not os.path.exists(filepath):
        print(f"Warning: Student survey file not found at {filepath}")
        return {}
    
    df = pd.read_excel(filepath)
    total_respondents = len(df)
    
    # Standardize column mapping
    col_map = {
        'Timestamp': 'timestamp',
        'Email Address': 'email',
        'What is your age group? ': 'age_group',
        'What is your gender?  ': 'gender',
        'In which state or Union Territory are you currently studying?  ': 'state',
        'Which area best describes the location of your institution?  ': 'institution_location',
        'What is your current level of education?  ': 'education_level',
        'What is your current field of study?  ': 'field_of_study',
        '  What type of institution do you attend?  ': 'institution_type',
        'How satisfied are you with the overall quality of education at your institution?  ': 'quality_satisfaction',
        'How accessible are the educational resources you need, such as books, study materials, libraries and laboratories?  ': 'resource_accessibility',
        'What are the challenges you face in your education?  ': 'challenges_faced',
        'How satisfied are you with the teaching methods at your institution?  ': 'teaching_methods_satisfaction',
        'Which digital learning resources do you use?  ': 'digital_learning_resources',
        'Which device do you primarily use for digital learning?  ': 'primary_device',
        'What is your biggest challenge with digital learning?  ': 'digital_learning_challenge',
        'How frequently do you use AI tools for academic purposes?  ': 'ai_usage_frequency',
        'For which academic purposes do you use AI?  ': 'ai_academic_purposes',
        'How much do you agree with the statement: “AI tools have improved my learning experience”?  ': 'ai_impact_agreement',
        'What are your concerns about using AI in education?  ': 'ai_concerns',
        'Have you participated in an internship?  ': 'internship_status',
        'How well do you think your current education is preparing you for employment?  ': 'job_readiness_perception',
        'Which skills do you consider most important for your future career?  ': 'important_career_skills',
        'What is your preferred career path after completing your current education?  ': 'preferred_career_path',
        'What do you believe is the biggest obstacle students face when entering the job market?  ': 'job_market_obstacle',
        'Which change would most improve your educational experience?  ': 'desired_educational_change',
        'How important do you think AI and digital skills will be for your future career?  ': 'ai_skills_future_importance',
        "What is one improvement you would suggest for India's education system?  ": 'suggested_system_improvement'
    }
    
    # Rename DataFrame columns
    renamed_df = df.rename(columns=col_map)
    
    # Summary Metrics
    ai_freq_vc = renamed_df['ai_usage_frequency'].value_counts()
    daily_or_weekly_ai = (ai_freq_vc.get('Daily', 0) + ai_freq_vc.get('Several times a week', 0))
    ai_regular_pct = round((daily_or_weekly_ai / total_respondents) * 100, 1)
    
    agree_vc = renamed_df['ai_impact_agreement'].value_counts()
    ai_positive_pct = round((agree_vc.get('Strongly agree', 0) / total_respondents) * 100, 1)
    
    intern_vc = renamed_df['internship_status'].value_counts()
    looking_intern_pct = round((intern_vc.get('No, but actively looking', 0) / total_respondents) * 100, 1)
    completed_intern_pct = round((intern_vc.get('Yes, completed one or more', 0) / total_respondents) * 100, 1)
    
    ai_imp_mean = round(pd.to_numeric(renamed_df['ai_skills_future_importance'], errors='coerce').mean(), 2)
    quality_mean = round(pd.to_numeric(renamed_df['quality_satisfaction'], errors='coerce').mean(), 2)
    teaching_mean = round(pd.to_numeric(renamed_df['teaching_methods_satisfaction'], errors='coerce').mean(), 2)
    
    # Meaningful text suggestions
    suggestions = []
    for s in renamed_df['suggested_system_improvement'].dropna().unique():
        s_clean = str(s).strip()
        if len(s_clean) > 8 and s_clean.lower() not in ['nothing', 'no', 'none', 'good', 'i don\'t know']:
            suggestions.append(s_clean)
            
    # Clean records list
    records = []
    for _, row in renamed_df.iterrows():
        rec = {}
        for col in renamed_df.columns:
            val = row[col]
            if pd.isna(val):
                rec[col] = None
            elif isinstance(val, (int, float)):
                rec[col] = val
            else:
                rec[col] = str(val).strip()
        records.append(rec)
        
    return {
        "summary": {
            "total_responses": total_respondents,
            "female_percentage": round((len(renamed_df[renamed_df['gender'] == 'Female']) / total_respondents) * 100, 1),
            "male_percentage": round((len(renamed_df[renamed_df['gender'] == 'Male']) / total_respondents) * 100, 1),
            "undergraduate_percentage": round((len(renamed_df[renamed_df['education_level'] == 'Undergraduate']) / total_respondents) * 100, 1),
            "ai_regular_users_pct": ai_regular_pct,
            "ai_positive_impact_pct": ai_positive_pct,
            "avg_ai_importance_rating": ai_imp_mean,
            "avg_quality_satisfaction": quality_mean,
            "avg_teaching_satisfaction": teaching_mean,
            "looking_for_internship_pct": looking_intern_pct,
            "completed_internship_pct": completed_intern_pct,
            "top_job_obstacle": "Lack of practical skills (37.1%)",
            "top_career_path": "Government-sector employment (29.5%)",
            "top_digital_tool": "YouTube & AI Tools"
        },
        "demographics": {
            "age_distribution": parse_single_select(renamed_df['age_group']),
            "gender_distribution": parse_single_select(renamed_df['gender']),
            "education_level": parse_single_select(renamed_df['education_level']),
            "field_of_study": parse_single_select(renamed_df['field_of_study']),
            "institution_type": parse_single_select(renamed_df['institution_type']),
            "institution_location": parse_single_select(renamed_df['institution_location']),
            "state_distribution": parse_single_select(renamed_df['state'])
        },
        "education_quality": {
            "quality_satisfaction": parse_single_select(renamed_df['quality_satisfaction']),
            "teaching_methods_satisfaction": parse_single_select(renamed_df['teaching_methods_satisfaction']),
            "resource_accessibility": parse_single_select(renamed_df['resource_accessibility']),
            "primary_challenges": parse_multi_select(renamed_df['challenges_faced'])
        },
        "digital_and_ai": {
            "device_usage": parse_single_select(renamed_df['primary_device']),
            "ai_frequency": parse_single_select(renamed_df['ai_usage_frequency']),
            "ai_impact_agreement": parse_single_select(renamed_df['ai_impact_agreement']),
            "ai_importance_ratings": parse_single_select(renamed_df['ai_skills_future_importance']),
            "ai_academic_purposes": parse_multi_select(renamed_df['ai_academic_purposes']),
            "ai_concerns": parse_multi_select(renamed_df['ai_concerns']),
            "digital_learning_challenges": parse_single_select(renamed_df['digital_learning_challenge'])
        },
        "career_and_employability": {
            "internship_status": parse_single_select(renamed_df['internship_status']),
            "job_readiness_perception": parse_single_select(renamed_df['job_readiness_perception']),
            "preferred_career_paths": parse_single_select(renamed_df['preferred_career_path']),
            "top_job_obstacles": parse_single_select(renamed_df['job_market_obstacle']),
            "most_important_skills": parse_multi_select(renamed_df['important_career_skills']),
            "desired_systemic_changes": parse_multi_select(renamed_df['desired_educational_change']),
            "student_suggestions": suggestions[:20]
        },
        "records": records
    }

def clean_all():
    print("Starting comprehensive multi-source data cleaning...")
    
    database = {
        "metadata": {
            "title": "LearnSphere: India Education, Employment & Student Perspectives Landscape",
            "years": ["2021-22", "2022-23", "2023-24"],
            "sources": [
                "UDISE+ (Department of School Education & Literacy, MoE)",
                "AISHE (Department of Higher Education, MoE)",
                "Periodic Labour Force Survey (PLFS, MoSPI)",
                "National Student Perspectives Primary Survey (2026)"
            ],
            "description": "Unified single analytical repository merging national macro datasets with primary grassroots student voice survey."
        },
        "school": {},
        "higher_ed": {},
        "employment": {},
        "student_survey": {},
        "cleaning_report": {
            "null_rows_removed": "Eliminated decorative Excel headers, trailing blanks, and unformatted metadata rows",
            "null_columns_removed": "Stripped empty spacer and Unnamed columns across all 15 sheets",
            "normalized_metrics": "Harmonized Year formats (YYYY-YY), standard State names, numeric conversion for all metric fields",
            "student_survey_processed": "Parsed 105 student survey responses across 28 questions with multi-select aggregation",
            "total_clean_records": 0
        }
    }

    # 1. UDISE School Sheets
    udise_path = find_file("UDISE DATA2.xlsx")
    if udise_path:
        database["school"]["schools_by_state"] = clean_sheet_data(udise_path, "Total_schools")
        database["school"]["enrollment_by_state"] = clean_sheet_data(udise_path, "Total_Schl_enrollment")
        database["school"]["teachers_by_state"] = clean_sheet_data(udise_path, "School_Teachers")
        database["school"]["indicators_by_state"] = clean_sheet_data(udise_path, "Sch_GER_GPI_PTR")
        database["school"]["infrastructure_by_state"] = clean_sheet_data(udise_path, "School_Infrastructure")
        database["school"]["all_india_summary"] = clean_sheet_data(udise_path, "All India Sch Calculation")
        database["school"]["all_india_infrastructure"] = clean_sheet_data(udise_path, "All India sch infrastr.")
        print("Processed UDISE+ School Education data.")

    # 2. AISHE Higher Ed & Employment Sheets
    aishe_path = find_file("AISHE DATA (1).xlsx")
    if aishe_path:
        database["higher_ed"]["institutions_by_state"] = clean_sheet_data(aishe_path, "Total_Uni_Clgs")
        database["higher_ed"]["enrollment_by_state"] = clean_sheet_data(aishe_path, "Total_unistudents_enrollment")
        database["higher_ed"]["teachers_by_state"] = clean_sheet_data(aishe_path, "Total_uni_teachers")
        database["higher_ed"]["indicators_by_state"] = clean_sheet_data(aishe_path, "Uni_GER GPI PTR")
        database["higher_ed"]["all_india_summary"] = clean_sheet_data(aishe_path, "All_India_uni_Calculation")

        database["employment"]["employment_rate_by_state"] = clean_sheet_data(aishe_path, "Employment_rate")
        database["employment"]["unemployment_rate_by_state"] = clean_sheet_data(aishe_path, "Unemployment_Rate")
        database["employment"]["all_india_summary"] = clean_sheet_data(aishe_path, "All India emp unemp rate")
        print("Processed AISHE Higher Education & Employment data.")

    # 3. Student Perspectives Survey
    survey_path = find_file("Student Perspectives on the Changing Landscape of Education in India.  (Responses) (4).xlsx")
    if survey_path:
        database["student_survey"] = clean_student_survey_data(survey_path)
        print("Processed Student Perspectives Survey data.")

    # Calculate total records
    total_records = 0
    for category in ["school", "higher_ed", "employment"]:
        for key in database[category]:
            total_records += len(database[category][key])
    if "records" in database["student_survey"]:
        total_records += len(database["student_survey"]["records"])
        
    database["cleaning_report"]["total_clean_records"] = total_records

    # Save to the single consolidated JSON file in required locations
    target_locations = [
        os.path.join(WEB_SRC_DATA, "education_data.json"),
        os.path.join(WEB_DIR, "clean_education_data.json"),
        os.path.join(PROJECT_DIR, "clean_education_data.json")
    ]

    for target in target_locations:
        with open(target, "w", encoding="utf-8") as f:
            json.dump(database, f, indent=2)
        print(f"Saved consolidated data file -> {target}")

    print(f"\nSUCCESS! All important data consolidated into a single file.")
    print(f"Total clean records: {total_records} (UDISE + AISHE + Student Survey)")

if __name__ == "__main__":
    clean_all()
