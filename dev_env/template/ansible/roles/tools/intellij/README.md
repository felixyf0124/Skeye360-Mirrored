# intellij role

Installs the latest version of intellij found in the `snap` tools repository,
creating the command line command `intellij-idea-community` for startup
from a terminal. See [Snap](#snap) for more details about snap.

## Role Variables

None.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/intellij
```
