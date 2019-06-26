# pyenv role

Installs [pyenv](https://github.com/pyenv/pyenv/blob/master/README.md),
a python utility to help manage python installations and
python virtual environments.

## Role Variables

See [defaults](defaults/main.yml) for role defaults for these variables.

### pyenv_path

Where to install pyenv.

### pyenv_owner

The pyenv installation files are `chown`ed to this user.

### pyenv_update_git_install

pyenv is distributed as a git repository.  Set to `yes` to update
the git repository, effectively upgrading pyenv.

### pyenv_enable_autocompletion

Boolean (yes/no): Whether to enable auto-completion of pyenv commands.

### pyenv_python_versions

List of python versions to install in the pyenv environment.

### pyenv_virtualenvs

List of {venv_name, py_version} entries specifying the virtual environments
to create.


## Example Playbook

To install the default version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/pyenv
```

To install pyenv, and also install a python version and a virtualenv:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: { tools/pyenv,
      pyenv_python_versions: [ '2.7.14' ],
      pyenv_virtualenvs: [ { venv_name: "2.7_latest", py_version: "2.7.14" } ]
     }
```
