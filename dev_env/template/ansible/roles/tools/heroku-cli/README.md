# heroku-cli role

Installs the Heroku CLI tool, useful to work with prototypes for
IOT projects on http://www.heroku.com.

The tool is installed using their apt repository, and so can be
upgraded with `apt-get upgrade`.


## Role Variables

None.


## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/heroku-cli
```
