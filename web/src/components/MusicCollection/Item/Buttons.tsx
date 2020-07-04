import IconButton from "@material-ui/core/IconButton"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import Tooltip from "@material-ui/core/Tooltip"
import DeleteIcon from "@material-ui/icons/Delete"
import FavoriteIcon from "@material-ui/icons/Favorite"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"
import ListIcon from "@material-ui/icons/List"

import React from "react"

export function DeleteButton(props: { onClick: () => void }) {
  const { onClick } = props

  return (
    <ListItemIcon
      onClick={(event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        onClick()
      }}
    >
      <Tooltip placement="left" title="Remove">
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </ListItemIcon>
  )
}

export function FavorButton(props: { onClick: () => void; favourite: boolean }) {
  const { favourite, onClick } = props

  return (
    <ListItemIcon
      onClick={(event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        onClick()
      }}
    >
      {favourite ? (
        <Tooltip placement="bottom" title="Remove from favourites">
          <IconButton>
            <FavoriteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip placement="bottom" title="Add to favourites">
          <IconButton>
            <FavoriteBorderIcon />
          </IconButton>
        </Tooltip>
      )}
    </ListItemIcon>
  )
}

export function ShowListButton(props: { onClick: () => void }) {
  const { onClick } = props

  return (
    <ListItemIcon
      onClick={(event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        onClick()
      }}
    >
      <Tooltip placement="bottom" title="View Playlist">
        <IconButton>
          <ListIcon />
        </IconButton>
      </Tooltip>
    </ListItemIcon>
  )
}
