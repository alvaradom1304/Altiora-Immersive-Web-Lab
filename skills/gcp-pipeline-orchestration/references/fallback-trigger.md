> [!IMPORTANT]
>
> **Fallback:** If `gcloud trigger` fails, use the bundled script: Run script
> with -- help to discover and learn the interface.
>
> ```
> python scripts/trigger/airflow_trigger.py \ --project <PROJECT_ID>
> --location <REGION> \ --environment <COMPOSER_ENV> --dag_id <PIPELINE_ID>
> ```
>
> Get `project`, `region`, and `composer_environment` from `deployment.yaml`.
