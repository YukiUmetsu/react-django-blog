import os
import sys

COMMANDS = ["startapp", "resetmigrate"]
HELP_TEXT = "please specify commands and singular_app_name like this: \r" \
            "python cmanage.py startapp quiz_groups\r" \
            "available commands:\r" + "\r".join(COMMANDS)


args = []
none_args = ["python", "cmanage.py"]
for arg in sys.argv:
    if arg not in none_args:
        args.append(arg)

if len(args) < 1:
    print(HELP_TEXT)
    exit()

command = args[0]
if command == "startapp":
    app_name = args[1]
    if len(args) > 2:
        print(args)
        singular_app_name = args[2]
        os.system(f"python manage.py startapp {app_name} && "
                  f"python manage.py runscript add_api --script-args {app_name} {singular_app_name}")
    else:
        os.system(f"python manage.py startapp {app_name} && "
                  f"python manage.py runscript add_api --script-args {app_name}")

if command == "resetmigrate":
    os.system("python manage.py runscript reset_migrate")
