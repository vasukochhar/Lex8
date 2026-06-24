import json
import os

transcript_path = "/Users/mayank/.gemini/antigravity-ide/brain/63e309f8-d173-4c3c-86d1-d308befcd428/.system_generated/logs/transcript.jsonl"

# Read all tool calls from the transcript
actions = []

with open(transcript_path, 'r') as f:
    lines = f.readlines()
    for line in lines:
        try:
            data = json.loads(line)
            if data.get('type') == 'PLANNER_RESPONSE' or data.get('type') == 'TOOL_CALLS':
                # tool calls are inside
                calls = data.get('tool_calls', [])
                for call in calls:
                    name = call.get('name')
                    args = call.get('arguments', {})
                    if name in ['replace_file_content', 'multi_replace_file_content', 'default_api:replace_file_content', 'default_api:multi_replace_file_content']:
                        actions.append(args)
        except Exception as e:
            pass

print(f"Found {len(actions)} replace actions.")

# Reverse the actions
actions.reverse()

for args in actions:
    target_file = args.get('TargetFile')
    if not target_file:
        continue
    if not os.path.exists(target_file):
        print(f"File {target_file} does not exist.")
        continue

    with open(target_file, 'r') as f:
        content = f.read()

    # Apply inverse replacement
    if 'ReplacementChunks' in args:
        chunks = args.get('ReplacementChunks', [])
        # To reverse, we must replace ReplacementContent with TargetContent
        for chunk in chunks:
            old_str = chunk.get('ReplacementContent', '')
            new_str = chunk.get('TargetContent', '')
            if old_str in content:
                content = content.replace(old_str, new_str)
            else:
                print(f"Could not find replacement chunk in {target_file}")
    else:
        old_str = args.get('ReplacementContent', '')
        new_str = args.get('TargetContent', '')
        if old_str in content:
            content = content.replace(old_str, new_str)
        else:
            print(f"Could not find replacement string in {target_file}")

    with open(target_file, 'w') as f:
        f.write(content)

print("Revert complete.")
