interface props {
    params : Promise<{
        projectId : string
    }>
}
async function ProjectHome({ params } : props) {
    const { projectId } = await params;
  return (
    <div>Project Id : {projectId}</div>
  )
}

export default ProjectHome