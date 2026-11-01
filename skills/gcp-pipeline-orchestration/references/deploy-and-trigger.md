### Step 6: Deploy the Orchestration Pipeline (Optional)

If requested to **deploy** the orchestration pipeline:

1.  You MUST ask the user which environment to deploy to. If no environment name
    is provided, list the available environments from `deployment.yaml` and ask
    the user to choose one, defaulting to `dev` if it exists.

2.  Read the orchestration YAML to extract the `pipelineId`.

3.  Deploy with `--local`. This uploads the DAG without running it:

    ```
    # Replace <ENV_NAME> with the target environment
    # Replace <PIPELINE_SOURCE> with the orchestration YAML filename
    gcloud beta orchestration-pipelines deploy \
      --environment=<ENV_NAME> --local
    ```

4.  Parse the deploy output to extract the **bundle ID** (version). The output
    includes a line like: `Pipeline deployment successful for version
    local-b32d15e307b5` The version string (e.g., `local-b32d15e307b5`) is the
    bundle ID.

> [!IMPORTANT]
>
> `--local` deployments now default to `--paused=true`. The deployed DAG will be
> visible in Airflow as a paused DAG without a schedule. It will **not**
> auto-run. Use Step 7 to trigger it.

### Step 7: Trigger the Orchestration Pipeline Run (Optional)

If requested to **trigger/run** the orchestration pipeline, you MUST follow the
Deploy → Poll → Trigger flow.

1.  **Ask for environment**: You MUST ask the user which environment to use.
    Default to `dev` if it exists in `deployment.yaml`.

2.  **Deploy first** (Step 6): Always deploy before triggering to ensure the run
    uses the latest code. Extract the `bundle ID` from deploy output and the
    `pipelineId` from the orchestration YAML.

3.  **Poll for DAG readiness**: Wait for the DAG to be registered in Composer.

    ```bash
    # Initial delay: wait 30 seconds after deploy
    sleep 30

    # Poll every 15 seconds, up to 2 minutes total
    # Replace <ENV_NAME>, <BUNDLE_ID> with actual values

    gcloud beta orchestration-pipelines list \
    --environment=<ENV_NAME> \
    --bundle=<BUNDLE_ID>
    ```

    The pipeline is ready when it appears in the list output. If it does not
    appear after 2 minutes, report failure and advise the user to check YAML
    validity.

4.  **Trigger the pipeline**:

    ```
    # Replace <ENV_NAME>, <BUNDLE_ID>, <PIPELINE_ID> with actual values
    gcloud beta orchestration-pipelines trigger \
    --environment=<ENV_NAME> \
    --bundle=<BUNDLE_ID> \
    --pipeline=<PIPELINE_ID>
    ```

5.  **Verify the run started**:

    ```
    gcloud beta orchestration-pipelines runs list \
    --environment=<ENV_NAME> \
    --bundle=<BUNDLE_ID> \
    --pipeline=<PIPELINE_ID>
    ```

> [!TIP]
>
> **Trigger-only (no deploy):** If the user wants to trigger an already-deployed
> pipeline, skip Step 6. Use `gcloud beta orchestration-pipelines list
> --environment=<ENV_NAME>` to find the bundle ID, then trigger directly with
> Step 7.4.

> **Fallback:** See [fallback-trigger.md](fallback-trigger.md) if direct trigger fails.
