import React, { useEffect } from 'react'
import './page.css'

export default function Page(props) {

  useEffect(() => {
    document.title = props.title
  }, [props.title])

  return (
    <div className={props.buttonPage ? 'page-layout-columns' : 'page-layout-rows'}>{props.children}</div>
  )
}
