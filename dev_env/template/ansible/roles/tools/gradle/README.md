# gradle role

Installs only a small gradle wrapper finder script in the system PATH.
This setup assumes gradle projects are setup to use the gradle wrapper.
When the user types `gradle`, the small finder script looks for the gradle
wrapper executable in the current directory and up all parent directories.

For upgrades, the gradle wrapper takes care of upgrading itself with the
gradle version specified in each project.


## Role Variables

None

## Example Playbook

To install the latest version of the gradle wrapper finder script:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/gradle
```
