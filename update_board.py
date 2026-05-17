import sys
from bs4 import BeautifulSoup
import re

with open("lex8_build_board.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

# Get columns
col_vasu = soup.find(id="col-vasu")
col_faiz = soup.find(id="col-faiz")
col_p3 = soup.find(id="col-p3")
col_anubhav = soup.find(id="col-anubhav")

# Move Anchor8 tasks to Anubhav
keywords_to_move = [
    "Anchor8", "Telemetry", "DID", "cassette", "W3C", "UAI", "replay attack"
]

def move_anchor8_tasks(col):
    if not col: return
    tasks = col.find_all("div", class_="task")
    for task in tasks:
        text = task.find("div", class_="t-text").get_text()
        if any(kw.lower() in text.lower() for kw in keywords_to_move):
            # Move to Anubhav
            task.extract()
            # Find the right phase section in Anubhav's column, or just append it
            phase = task.get("data-phase")
            # Create phase label if not exists in Anubhav
            phase_lbl = col_anubhav.find("div", text=re.compile(f"Phase {phase}", re.IGNORECASE))
            if not phase_lbl:
                lbl = soup.new_tag("div", attrs={"class": "section-lbl"})
                lbl.string = f"Phase {phase} — Migrated Anchor8 Tasks"
                col_anubhav.append(lbl)
            col_anubhav.append(task)

move_anchor8_tasks(col_vasu)
move_anchor8_tasks(col_faiz)
move_anchor8_tasks(col_p3)

# Mark Vasu's remaining Phase 0 and Phase 1 tasks as done
for task in col_vasu.find_all("div", class_="task"):
    phase = task.get("data-phase")
    if phase in ["0", "1"]:
        if "done" not in task.get("class", []):
            task["class"] = task.get("class", []) + ["done"]

# Mark Faiz's Phase 0 and Phase 1 tasks as done (since I did them)
for task in col_faiz.find_all("div", class_="task"):
    phase = task.get("data-phase")
    if phase in ["0", "1"]:
        if "done" not in task.get("class", []):
            task["class"] = task.get("class", []) + ["done"]

# Add new tasks to Vasu
new_task_html = """
<div class="task done" data-phase="1" onclick="toggle(this)">
    <div class="chk"><svg class="chk-mark" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" /></svg></div>
    <div class="t-body">
        <div class="t-text">Lex8 Core Canary tests: test_phase1.py for Drafter, Filer, Vault Vision, Forecast, Case Synth</div>
        <div class="t-meta"><span class="phase-tag pt1">Phase 1</span><span class="dot d-high"></span></div>
    </div>
</div>
"""
new_task_soup = BeautifulSoup(new_task_html, "html.parser")
col_vasu.append(new_task_soup)

with open("lex8_build_board_updated.html", "w", encoding="utf-8") as f:
    f.write(str(soup))
