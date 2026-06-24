import json
import os

transcript_path = "/Users/mayank/.gemini/antigravity-ide/brain/63e309f8-d173-4c3c-86d1-d308befcd428/.system_generated/logs/transcript.jsonl"

files_to_restore = [
    "src/app/globals.css",
    "src/app/layout.tsx",
    "src/components/Navbar.tsx",
    "src/components/Hero.tsx",
    "src/components/SecurityLanes.tsx",
    "src/components/Tribunal.tsx",
    "src/components/Comparison.tsx",
    "src/components/Ledger.tsx",
    "src/components/Archetypes.tsx",
    "src/components/Provenance.tsx",
    "src/components/ComplianceBanner.tsx",
    "src/components/FinalCTA.tsx",
    "src/components/Footer.tsx",
]

restored = {}

with open(transcript_path, 'r') as f:
    lines = f.readlines()
    for line in lines:
        try:
            data = json.loads(line)
            if data.get('type') == 'TOOL_RESPONSE' and data.get('source') == 'SYSTEM':
                content = data.get('content', '')
                if 'File Path: ' in content and 'The following code has been modified to include a line number' in content:
                    for filename in files_to_restore:
                        if f"File Path: `file:///Users/mayank/Coding/demo/{filename}`" in content:
                            if filename not in restored: # only keep the first one seen (oldest)
                                # Extract original content
                                # The content has lines like "1: content..."
                                lines_of_file = []
                                capture = False
                                for c_line in content.split('\n'):
                                    if c_line.startswith('1: '):
                                        capture = True
                                    if 'The above content shows the entire' in c_line:
                                        capture = False
                                    if capture:
                                        # strip the line number
                                        parts = c_line.split(': ', 1)
                                        if len(parts) == 2 and parts[0].isdigit():
                                            lines_of_file.append(parts[1])
                                        elif len(parts) == 1 and c_line.endswith(':'): # empty line maybe?
                                            lines_of_file.append('')
                                restored[filename] = '\n'.join(lines_of_file)
        except Exception as e:
            pass

for filename, content in restored.items():
    print(f"Restoring {filename}")
    with open(f"/Users/mayank/Coding/demo/{filename}", 'w') as f:
        f.write(content)

print("Done")
