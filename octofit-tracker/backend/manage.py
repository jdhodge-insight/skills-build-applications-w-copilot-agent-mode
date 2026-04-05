#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import subprocess

# If a virtualenv exists at backend/venv, and we're not already running
# inside it, re-exec this script with the venv's Python interpreter so
# local `python3 manage.py ...` calls use the project's environment.
_proj_root = os.path.dirname(os.path.abspath(__file__))
_venv_py = os.path.join(_proj_root, 'venv', 'bin', 'python')
if os.path.exists(_venv_py):
    # Detect if current interpreter is the venv Python
    try:
        current_path = os.path.normpath(os.path.abspath(sys.executable))
        venv_path = os.path.normpath(os.path.abspath(_venv_py))
    except Exception:
        current_path = sys.executable
        venv_path = _venv_py
    if current_path != venv_path:
        try:
            os.execv(venv_path, [venv_path] + sys.argv)
        except Exception:
            # If exec fails, fall back and let the usual ImportError raise.
            pass


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'octofit_tracker.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
