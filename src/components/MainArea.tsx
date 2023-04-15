import { FC } from 'react'

interface MainbarProps {
  visible: boolean
}

const MainArea: FC<MainbarProps> = ({ visible }) => {
  const style = {
    width: visible ? '70vw' : '90vw',
  }
  return (
    <div className="mainArea" style={style}>
      <div className="mainArea-date">
        <span>14.04.2023 г.</span>
      </div>
      <div>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error reiciendis recusandae vel
          eum tempore veritatis nihil doloremque necessitatibus eveniet velit laudantium, delectus,
          porro distinctio numquam maxime provident officia molestiae saepe?
        </p>
      </div>
    </div>
  )
}

export default MainArea
