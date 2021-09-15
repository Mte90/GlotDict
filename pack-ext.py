#!/usr/bin/python3

print("Browser Extension packager by Mte90")
print("The only parameter required is the folder path!")

import sys, os, json, zipfile

def zipdir(path,name):
    zipf = zipfile.ZipFile(name, 'w', zipfile.ZIP_DEFLATED)
    exclude_prefixes = ['__', '.', 'eslinttrc','tests']  # list of exclusion prefixes
    exclude_suffixes = ['.xpi', '.zip', '.py', 'ISSUE_TEMPLATE.md', 'README.md']  # list of exclusion suffix
    for dirpath, dirnames, filenames in os.walk(path):
        # exclude all dirs/files starting/endings
        dirnames[:] = [dirname
                       for dirname in dirnames
                       if all([dirname.startswith(string) is False
                              for string in exclude_prefixes])
                       is True]
        filenames[:] = [filename
                       for filename in filenames
                       if (all([filename.startswith(string) is False for string in exclude_prefixes]))
                       and (all([filename.endswith(string) is False for string in exclude_suffixes]))
                       is True]
        for file_found in filenames:
            zipf.write(os.path.join(dirpath, file_found))
    zipf.close()

if len(sys.argv) > 1 and os.path.isdir(sys.argv[1]):
    manifest = sys.argv[1] + '/manifest.json'
    if os.path.isfile(manifest):
        with open(manifest) as content:
            data = json.load(content)
            name = data['name'].replace(' ', '-') + '_v' + data['version']
            zipdir(sys.argv[1], name + '.zip')
            print("-Package done!")
    else:
        print("The file" + manifest + " not exist")
        sys.exit()
else:
    print("Path not found")
    sys.exit()


