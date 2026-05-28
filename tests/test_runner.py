import pytest
import sys
import argparse


class BeautifulReporter:
  def __init__(self, verbose=False):
    self.verbose = verbose

  def pytest_runtest_logreport(self, report):
    if report.when == 'call':
      name = report.nodeid.split('::')[-1]
      if report.passed:
        print(f"  \033[32m✔\033[0m {name} \033[1;32mPASSED\033[0m")
      elif report.failed:
        print(f"  \033[31m✘\033[0m {name} \033[1;31mFAILED\033[0m")
        print(f"    \033[0;33m{report.longreprtext}\033[0m")


if __name__ == "__main__":
  parser = argparse.ArgumentParser()
  parser.add_argument("-v", "--verbose", action="store_true", help="Детальный вывод")
  args = parser.parse_args()

  # Если verbose=True, убираем -q (quiet) и используем стандартный вывод
  pytest_args = ["tests/"]
  plugins = []

  if not args.verbose:
    pytest_args.append("-q")
    plugins = [BeautifulReporter()]

  exit_code = pytest.main(pytest_args, plugins=plugins)
  sys.exit(exit_code)