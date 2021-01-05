import React from 'react'
import PageTitle from './PageTitle'
import RefreshButton from './RefreshButton'

const PageHeader = ({title, breadcrumbText, breadcrumbUrl, load, loading}) => 
  <div className="page-header">
    <RefreshButton load={load} loading={loading} />
    <PageTitle title={title} breadcrumbText={breadcrumbText} breadcrumbUrl={breadcrumbUrl} />
  </div>

export default PageHeader

