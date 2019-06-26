# android-studio role

Installs the latest version of android studio with snap, so it's kept up-to-date automatically.
The tool is then available in the desktop menu.

## Role Variables

None.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/android-studio
```
