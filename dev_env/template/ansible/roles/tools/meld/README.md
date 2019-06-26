# meld role

Installs the meld diff/merge tool.  A good git 'mergetool'.  Less feature-packed
than kdiff3, but much more lightweight installation.

To use it for git:

```
git config --global diff.tool meld
git config --global merge.tool meld
```

You may want to consider instead using the merge tool
integrated into `intellij`.

## Role Variables

None.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/meld
```
