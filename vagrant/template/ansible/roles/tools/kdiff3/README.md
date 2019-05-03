# kdiff3 role

Installs the KDiff3 diff/merge tool.  Very nice as a git 'mergetool', but beware
that it brings with it a lot of KDE dependencies (very big install). You may want
to use IntelliJ's integrated merge tool instead.

Installed as an APT package, so gets upgraded with the standard OS package
management utilities.

To use it for git:

```
git config --global diff.tool kdiff3
git config --global merge.tool kdiff3
```

## Role Variables

None.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/kdiff3
```
