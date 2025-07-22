
import os

# Folders to ignore
EXCLUDE_DIRS = {"node_modules", ".git", ".next", "dist", "build", "__pycache__"}

def list_files_and_folders(root_dir, indent=""):
    try:
        for entry in sorted(os.listdir(root_dir)):
            path = os.path.join(root_dir, entry)
            # Skip excluded directories
            if os.path.isdir(path):
                if entry in EXCLUDE_DIRS:
                    continue
                print(f"{indent}[DIR] {entry}")
                list_files_and_folders(path, indent + "    ")
            else:
                print(f"{indent}{entry}")
    except PermissionError:
        print(f"{indent}[Permission Denied] {root_dir}")

if __name__ == "__main__":
    start_dir = os.getcwd()  # Run in current directory
    print(f"Listing files and folders in: {start_dir}\n")
    list_files_and_folders(start_dir)
