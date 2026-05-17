import argparse
import redis
import sys

def get_redis_client():
    try:
        return redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    except Exception as e:
        print(f"Failed to connect to Redis: {e}")
        sys.exit(1)

def set_scenario(scenario, state):
    r = get_redis_client()
    key = f"demo:recovery:{scenario}"
    
    if state == "trigger":
        r.set(key, "true")
        print(f"[TRIGGERED] {scenario} failure mode is now ACTIVE.")
    elif state == "resolve":
        r.delete(key)
        print(f"[RESOLVED] {scenario} failure mode is now DISABLED.")
    else:
        print(f"Invalid state: {state}. Use 'trigger' or 'resolve'.")

def get_status():
    r = get_redis_client()
    scenarios = ["drafter_timeout", "vault_vision_ocr_fail", "war_room_deadlock"]
    print("\n--- Lex8 Dry Run: Recovery State ---")
    for s in scenarios:
        val = r.get(f"demo:recovery:{s}")
        status = "[FAIL] FAILING" if val == "true" else "[OK] HEALTHY"
        print(f"{s.ljust(25)}: {status}")
    print("------------------------------------\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Lex8 Dry Run Recovery Scripts Manager")
    parser.add_argument("action", choices=["trigger", "resolve", "status"], help="Action to perform")
    parser.add_argument("scenario", nargs="?", choices=["drafter_timeout", "vault_vision_ocr_fail", "war_room_deadlock", "all"], help="Which scenario to target")

    args = parser.parse_args()

    if args.action == "status":
        get_status()
    elif args.scenario == "all":
        scenarios = ["drafter_timeout", "vault_vision_ocr_fail", "war_room_deadlock"]
        for s in scenarios:
            set_scenario(s, args.action)
    elif args.scenario:
        set_scenario(args.scenario, args.action)
    else:
        print("Please specify a scenario to trigger or resolve.")
