# mysql role

Installs the MySQL database.

## Role Variables

See [defaults](defaults/main.yml) for role defaults for these variables.

### mysql_root_pass

Root account password.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/mysql
```
