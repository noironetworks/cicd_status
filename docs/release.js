fetch('release_artifacts/releases.yaml')
  .then(response => response.text())
  .then(data => {
    const parsedData = jsyaml.load(data);
    console.log("Parsed YAML file 'release_artifacts/releases.yaml':", parsedData);

    const releaseTable = document.querySelector('#release-table');
    const tableBody = releaseTable.querySelector('tbody');

    const urlParams = new URLSearchParams(window.location.search);
    const releaseName = urlParams.get('release');

    for (const release of parsedData.releases) {
      if (release.release_name === releaseName) {
        for (const image of release.images) {
          const releaseRow = document.createElement('tr');

          const releaseNameCell = document.createElement('td');
          releaseNameCell.textContent = image.name;
          releaseRow.appendChild(releaseNameCell);

          const quayTagShaCell = document.createElement('td');
          const quayTag = image.tags.quay.tag;
          const quaySha = image.tags.quay.sha;
          quayTagShaCell.textContent = `Tag: ${quayTag}, SHA: ${quaySha}`;
          releaseRow.appendChild(quayTagShaCell);

          const dockerTagShaCell = document.createElement('td');
          const dockerTag = image.tags.docker.tag;
          const dockerSha = image.tags.docker.sha;
          dockerTagShaCell.textContent = `Tag: ${dockerTag}, SHA: ${dockerSha}`;
          releaseRow.appendChild(dockerTagShaCell);

          const sbomCell = document.createElement('td');
          sbomCell.textContent = image.sbom;
          releaseRow.appendChild(sbomCell);

          const cveCell = document.createElement('td');
          cveCell.textContent = image.cve;
          releaseRow.appendChild(cveCell);

          const buildLogsCell = document.createElement('td');
          buildLogsCell.textContent = image['build-logs'];
          releaseRow.appendChild(buildLogsCell);

          tableBody.appendChild(releaseRow);
        }
        break;
      }
    }
  })
  .catch(error => {
    console.error("Error loading YAML file 'release_artifacts/releases.yaml':", error);
  });