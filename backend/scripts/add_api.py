import os
import sys
import shutil

HELP_TEXT = "please specify app_name and singular_app_name like this: \rpython add_api.py books book"
SETTINGS_FOLDER = "blog"

def run(app_name, singular_app_name):
    app_name_exist = bool(app_name)
    if app_name_exist and not bool(singular_app_name):
        singular_app_name = app_name.rstrip("s")

    if not app_name_exist or not singular_app_name or app_name in ["--help", "-h"]:
        print(HELP_TEXT)
        return

    current_dir = os.path.dirname(os.path.realpath(__file__))
    target_dir = f"{current_dir}/../{app_name}"
    tmp_dir = f"{current_dir}/templates/tmp"

    copy_files(current_dir, target_dir, tmp_dir)
    remove_original_test_file(target_dir)

    model_name = get_model_name(app_name)
    replaces = [("app_name__", app_name), ("Model__", model_name), ("singular__", singular_app_name)]
    files = get_files(target_dir)
    for file in files:
        replaceWordsInFile(file, replaces)

    os.rename(f"{target_dir}/tests/test_template.py", f"{target_dir}/tests/test_{app_name}_models.py")
    target_file = f'{current_dir}/../{SETTINGS_FOLDER}/settings.py'
    add_app_name_in_config(app_name, target_file)


def remove_original_test_file(target_dir):
    test_file_path = target_dir+"/tests.py"
    if os.path.exists(test_file_path):
        os.remove(test_file_path)


def copy_files(current_dir, target_dir, tmp_dir):

    try:
        original_views_path = target_dir+"/views.py"
        if os.path.exists(original_views_path):
            shutil.copy2(original_views_path, tmp_dir)
            os.remove(original_views_path)

        org_files = get_files(current_dir+"/templates")
        for org_file in org_files:
            if "tests" in org_file:
                os.makedirs(target_dir +"/tests", 0o777, True)
                shutil.copy2(org_file, target_dir+"/tests")
            else:
                shutil.copy2(org_file, target_dir)

        os.remove(f"{tmp_dir}/views.py")

    except OSError as e:
        print(f"Something wrong happened... The original views.py exist in {tmp_dir}")
        print(e)


def get_files(target_dir):
    return [
        f"{target_dir}/urls.py",
        f"{target_dir}/views.py",
        f"{target_dir}/serializers.py",
        f"{target_dir}/tests/test_template.py"
    ]


def get_model_name(app_name):
    name_arr = app_name.split("_")
    new_arr = []
    for name in name_arr:
        new_arr.append(name.capitalize())
    return "".join(new_arr)


def replaceWordsInFile(file_path, replaces):
    """
    replaces object should be a list of tuples, (target of replace, new word)
    """
    fin = open(file_path, "rt")
    data = fin.read()
    for replace in replaces:
        data = data.replace(replace[0], replace[1])
    fin.close()

    fin = open(file_path, "wt")
    fin.write(data)
    fin.close()


def add_app_name_in_config(app_name, target_file):
    passed_installed_apps = False
    file_content = ""
    inserted = False
    is_app_name_included = False
    with open(target_file, "r+") as file:
        for line in file:
            if "INSTALLED_APPS" in line:
                passed_installed_apps = True
            if f"'{app_name}'" in line:
                is_app_name_included = True
            if "]" in line and passed_installed_apps and not is_app_name_included:
                file_content += f"    '{app_name}',\n" + line
                is_app_name_included = True
            else:
                file_content += line

        file.seek(0)
        file.write(file_content)
