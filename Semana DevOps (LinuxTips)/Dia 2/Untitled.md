```ss -tlnp | grep 8080```
>(nenhuma saída)

```systemctl status webapp```

>webapp.service - Web Application Active: failed (Result: exit-code) Process: 5678 ExecStart=/usr/bin/webapp (code=exited, status=1/FAILURE)

```journalctl -u webapp --no-pager -n 20```

>Mar 03 10:00:00 server webapp[5678]: Error: EADDRINUSE port 8080 Mar 03 10:00:00 server webapp[5678]: Another process is using the required port
