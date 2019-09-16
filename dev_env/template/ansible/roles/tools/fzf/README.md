# fzf role

Installs the [Fuzzy Finder tool](https://github.com/junegunn/fzf/blob/master/README.md),
an interactive Unix filter for command-line that can be used with any list:
files, command history, processes, hostnames, bookmarks, git commits, etc.

## Role Variables

See [defaults](defaults/main.yml) for the current defaults for these variables.

### fzf_path

Where to install fuzzy finder.

### fzf_owner

The user for which to install fuzzy finder.

### fzf_update_git_install

Boolean (yes/no).  Whether to update the git repository that contains
the installation of fuzzy finder.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/fzf
```
