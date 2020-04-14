# Backend

## Enable Git Hook
A pre-commit git hook is kept in the .githooks directory to help prevent
commits containing passwords, tokens, or secrets. Configure git to execute
these hooks with the following.
```
git config core.hooksPath .githooks
```

Git hook not working? Make sure the script has execute permissions. Print out
the octal permissions with the following (UNIX-based systems or in Git Bash)
```
stat -c "%a %n" ./.githooks/*
```

## Python
* Good practice: use virtualenv
* Get required python modules
    ```
    pip install -r requirements.txt
    ```
