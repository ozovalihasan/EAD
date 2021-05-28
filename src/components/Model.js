import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  addItem,
  changeContent,
  changeType,
  checkDirection,
  cloneItem,
  expandItem,
  idCountIncrease,
  updateRestrictedDropId,
} from '../redux';
import colors from './colors';

const Model = ({
  parentId,
  item,
  allItems,
  checkDragDropCategory,
}) => {
  const {
    restrictedDropId, draggedItemId, restrictedParentIds,
    disabledChildIds, expandAll, idCount, compactMode,
  } = useSelector((state) => state.block);

  const dispatch = useDispatch();

  const [expandContainer, setExpandContainer] = useState(-1);

  const existRestrictedDrop = (restrictedDropId !== -1);

  const isRestrictedDrag = (id) => (
    existRestrictedDrop
    && (
      !checkDragDropCategory(id, restrictedDropId)
      || restrictedDropId === id
      || restrictedParentIds.includes(id)
    )
  );

  const handleClone = (id, index) => {
    const restictedArea = ((restrictedDropId !== -1
      && (
        allItems[restrictedDropId].association
        || allItems[restrictedDropId].entityContainer
      )
    ));
    dispatch(cloneItem(
      id,
      restictedArea ? restrictedDropId
        : parentId,
      restictedArea ? 0 : (index + 1),
      idCount,
    ));
    if (
      restrictedDropId !== -1
      && allItems[restrictedDropId].association
    ) {
      dispatch(updateRestrictedDropId(idCount, null));
    }
    dispatch(idCountIncrease());
  };

  return (
    <SubContainer
      subdirection={item.subdirection}
      factory={item.factory}
      data-testid="subContainer"

    >
      {item.subItemIds.map((id, index) => (
        <Container
          ead={item.category === 'EAD'}
          association={item.association}
          subdirection={item.subdirection}
          key={id}
          entity={item.entity || item.entityClone}
        >

          <Draggable
            draggableId={id.toString()}
            index={index}
            isDragDisabled={allItems[id].isDragDisabled || isRestrictedDrag(id)}

          >
            {(providedDrag, snapshot) => (
              <DragContainer
                {...providedDrag.draggableProps}
                {...providedDrag.dragHandleProps}
                ref={providedDrag.innerRef}
                isDragging={snapshot.isDragging}
                isDraggingOver={snapshot.draggingOver}
                backgroundColor={colors[allItems[id].category]}
                isRestrictedDrag={isRestrictedDrag(id)}
                isRestrictedDrop={restrictedDropId === id}
                name="isRestrictedDrop"
              >

                <TitleCheck
                  association={allItems[id].association}
                  factory={allItems[id].factory}
                  entity={allItems[id].entity}
                >

                  { !(allItems[id].category === 'factory') && (
                    <ButtonContainer
                      onFocus={() => setExpandContainer(id)}
                      onMouseOver={() => setExpandContainer(id)}
                      onMouseLeave={() => setExpandContainer(-1)}
                    >
                      <HoverIcon>
                        <FontAwesomeIcon icon="plus" />
                      </HoverIcon>

                      {
                    (expandContainer === id)
                    && (
                    <HoverContainer>
                      {
                        (allItems[id].factory || allItems[id].attribute)
                        // || compactMode
                        || (
                          <RestrictedDrop
                            type="button"
                            title="Click to drop any item into this element"
                            restricted={restrictedDropId === id}
                            onClick={() => dispatch(updateRestrictedDropId(id, restrictedDropId))}
                          >
                            <FontAwesomeIcon icon="flag" />
                          </RestrictedDrop>
                        )
                      }
                      {
                        allItems[id].isDragDisabled
                        // || compactMode
                        || (
                          <HandleDrag
                            {...providedDrag.dragHandleProps}
                            title="Drag to move this item"
                            isRestrictedDrag={isRestrictedDrag(id)}

                          >
                            <FontAwesomeIcon icon="arrows-alt" size="lg" />
                          </HandleDrag>
                        )
                      }

                      {
                        !allItems[id].isDragDisabled
                        && allItems[id].entity
                        && !allItems[id].factory
                        // && !compactMode
                        && (
                          <CloneButton
                            title="Clone this entity"
                            type="button"
                            onClick={() => handleClone(id, index)}
                            isRestrictedDrag={isRestrictedDrag(id)}
                          >

                            <FontAwesomeIcon icon="clone" size="lg" />
                          </CloneButton>
                        )
                      }

                      {
                        allItems[id].factory
                        || allItems[id].attribute
                        || allItems[id].isDragDisabled
                        || compactMode
                        || (
                          <ExpandButton
                            name="expand"
                            type="button"
                            title="Expand or shrink this item"
                            onClick={() => dispatch(expandItem(id))}
                            expand={allItems[id].expand}
                            expandAll={expandAll}
                          >
                            <FontAwesomeIcon icon={allItems[id].expand ? 'compress-alt' : 'expand-alt'} size="lg" />
                          </ExpandButton>
                        )
                      }

                      {
                        !(allItems[id].factory || allItems[id].attribute || compactMode)
                        && (
                          <DirectionButton
                            name="direction"
                            type="button"
                            title="Align items vertically or horizontally"
                            onClick={() => dispatch(checkDirection(id, allItems))}
                          >
                            <FontAwesomeIcon icon={allItems[id].order === 'vertical' ? 'ellipsis-h' : 'ellipsis-v'} size="lg" />
                          </DirectionButton>
                        )
                      }

                    </HoverContainer>
                    )
                  }

                    </ButtonContainer>
                  )}
                  {restrictedDropId !== -1
                    && allItems[restrictedDropId].entityClone
                    && allItems[id].association
                    && allItems[id].factory
                    && (
                      <FastMove
                        onClick={() => {
                          dispatch(addItem(id, restrictedDropId, 0, idCount));
                          if (allItems[id].association) {
                            dispatch(updateRestrictedDropId(idCount, null));
                          }
                          dispatch(idCountIncrease());
                        }}
                      >
                        <FontAwesomeIcon icon="plane-departure" />
                      </FastMove>
                    )}
                  {
                    !allItems[id].isDragDisabled
                    && allItems[id].entity
                    && !allItems[id].factory
                    // && !compactMode
                    && restrictedDropId !== -1
                    && (
                      allItems[restrictedDropId].association
                      || allItems[restrictedDropId].entityContainer
                    )
                    && (
                      <CloneButton
                        title="Clone this entity"
                        type="button"
                        onClick={() => handleClone(id, index)}
                        isRestrictedDrag={isRestrictedDrag(id)}
                      >

                        <FontAwesomeIcon icon="clone" size="lg" />
                      </CloneButton>
                    )
                  }

                  {
                    (
                      ((allItems[id].entity || allItems[id].attribute || allItems[id].entityClone)
                      && !allItems[id].factory) ? (
                        <ModelInput
                          type="text"
                          onChange={
                            (e) => (!allItems[id].factory) && dispatch(changeContent(e, id))
                          }
                          value={allItems[id].content}
                        />
                        ) : (
                          <TitleContainer>
                            <Title>
                              {
                                allItems[id].association && !allItems[id].factory
                                  ? (
                                    <Flex>

                                      <svg height={60} width="100%" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                        {(
                                          (
                                            allItems[id].content === 'has_one' && (
                                            <path
                                              d="M 9,0 9,18"
                                              stroke="black"
                                              fill="transparent"
                                            />
                                            )
                                          ) || (
                                            allItems[id].content === 'has_many' && (
                                            <path
                                              d="M 0,18 9,9 M 18,18 9,9 M 9,0 v 18"
                                              stroke="black"
                                              fill="transparent"
                                            />
                                            )
                                          ) || (
                                            allItems[id].content === ':through' && (
                                              <path
                                                d="m 9,0 -0,3.25 m 0,3.5 -0,3.75 m 0,4.25 L 9,18"
                                                stroke="black"
                                                fill="transparent"
                                              />
                                            )
                                          )

                                        )}

                                      </svg>

                                    </Flex>
                                  )

                                  : (
                                    allItems[id].content
                                  )
                              }

                            </Title>
                          </TitleContainer>
                        )
                    )
                  }
                  { allItems[id].entityClone
                     && (allItems[(allItems[id].cloneParent)].content)}
                  {
                    (allItems[id].attribute) && (
                      <select
                        value={allItems[id].type}
                        onChange={(e) => dispatch(changeType(e, id))}
                      >
                        {['primary_key', 'string', 'text', 'integer', 'float', 'decimal', 'datetime', 'timestamp',
                          'time', 'date', 'binary', 'boolean', 'references'].map((item) => (
                            <option
                              key={item}
                              value={item}
                            >
                              {item}
                            </option>
                        ))}

                      </select>
                    )
                  }

                </TitleCheck>

                {allItems[id].attribute || (
                  <Droppable
                    droppableId={id.toString()}
                    direction={allItems[id].order}
                    isDropDisabled={
                      disabledChildIds.includes(id)
                      || allItems[id].isDropDisabled
                      || allItems[id].factory
                      || (
                        existRestrictedDrop && restrictedDropId !== id
                      )
                      || (
                        draggedItemId !== -1
                        && !checkDragDropCategory(draggedItemId, id)
                      )
                    }
                  >
                    {(providedDrop, snapshot) => (
                      <DropContainer
                        {...providedDrop.droppableProps}
                        ref={providedDrop.innerRef}
                        factory={allItems[id].factory}
                        isDraggingOver={snapshot.isDraggingOver}
                        isDropDisabled={
                          disabledChildIds.includes(id)
                          || allItems[id].isDropDisabled
                          || allItems[id].factory
                          || (existRestrictedDrop && restrictedDropId !== id)
                          || (draggedItemId !== -1
                            && !checkDragDropCategory(draggedItemId, id)
                          )
                        }
                      >
                        {(expandAll || allItems[id].expand)
                          ? (
                            <Model
                              parentId={id}
                              item={allItems[id]}
                              allItems={allItems}
                              index={index}
                              checkDragDropCategory={checkDragDropCategory}
                            />
                          )
                          : (
                            <div>
                              {allItems[id].subItemIds.length}
                              {' '}
                              item(s) collided
                            </div>
                          )}
                        {providedDrop.placeholder}
                      </DropContainer>
                    )}
                  </Droppable>
                )}
              </DragContainer>
            )}
          </Draggable>
        </Container>
      ))}

    </SubContainer>
  );
};

const Container = styled.div`
  margin: 1px;
  /* border-radius: 5px; */
  margin: ${(props) => (props.ead ? '25px' : '0')};
  /* margin: ${(props) => ((props.subdirection === 'column') && '0 0 0 10px')}; */
  padding: 0 0 0 10px;
  border-left: ${(props) => (!props.ead && props.subdirection === 'column' && 'solid 1px gray')};
  
`;

const TitleCheck = styled.div`
  display: flex;
  align-items: center;
  padding: 0 3px;
  border-bottom: 1px solid gray;
  border: ${((props) => props.association && 'none')};
  border: ${((props) => (props.factory || props.entity) && 'none')};
`;

const HoverContainer = styled.div`
  display: flex;
  position: absolute;
  transform: translateX(-3px);
  z-index: 1;
  background-color: ${colors.factory};
  transition: width 1s; 
  border-radius: 3px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 30px;
  height: 30px;
`;

const HoverIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
`;

const ModelInput = styled.input`
  outline: none;
  border: none ;
  border-radius: 2px;
  color: black;
  font-size: 16px;
  font-weight: 700;
  width: 125px;
  margin: 0 3px;  
`;

const ActionButton = styled.button`
  background-color: white; 
  outline: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 3px;
`;

const Flex = styled.div`
  width: 100%;
  display: flex;
  height: 0;
  justify-content: space-between; 
  transform: translateY(-30px);
`;

const FastMove = styled(ActionButton)`
  border: 1px solid #8AC926;

&:hover {
  cursor: pointer;
}
`;

const DirectionButton = styled(ActionButton)`
  border: 1px solid #1982C4;

  &:hover {
    cursor: pointer;
  }
`;

const CloneButton = styled(ActionButton)`
  border: 1px solid #1982C4;

  &:hover {
    cursor: pointer;
  }
`;

const RestrictedDrop = styled(ActionButton)`
  color: ${(props) => (props.restricted ? 'inherit' : 'transparent')};
  border-radius: 10px;
  border: #CCC5B9 solid 1px;
  margin: 0 4px;

  &:hover{
    cursor: pointer;
  }
`;

const ExpandButton = styled(ActionButton)`
  border: 1px solid #FFCA3A;
  background-color: ${(props) => (props.expandAll && colors.association)};

  &:hover {
    cursor: pointer;
  }
`;

const HandleDrag = styled(ActionButton)`
  border: 1px solid #8AC926;
  border-radius: 5px;
  background-color: ${(props) => (props.isRestrictedDrag && colors.disabled)};

  &:hover {
    cursor: inherit;
  }
`;

const DropContainer = styled.div`
  
  /* border-radius: 5px; */
  background-color: ${(props) => (props.isDraggingOver ? colors.suitable : colors.EAD)};
  background-color: ${(props) => (props.isDropDisabled && !props.factory && colors.disabled)};

`;
const DragContainer = styled.div`
  /* padding: 2px; */
  margin-top: 10px;
  border-radius: 5px;
  background-color: ${(props) => (props.backgroundColor)};
  background-color: ${(props) => (props.isDragging && colors.suitable)};
  background-color: ${(props) => (!props.isDraggingOver && props.isDragging && colors.warning)};
  background-color: ${(props) => (props.isRestrictedDrag && colors.disabled)};
  background-color: ${(props) => (props.isRestrictedDrop && colors.chosen)};
  /* border: 1px solid gray; */
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => props.subdirection};
  min-height: ${(props) => (props.factory ? '0' : '100px')};
  /* border-radius: 5px; */
`;

const TitleContainer = styled.div`
width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* width: 100%; */
`;

const Title = styled.h3`
  width: 100%;
  /* margin: 0 auto; */
`;

Model.propTypes = {
  parentId: PropTypes.number.isRequired,
  item: PropTypes.shape().isRequired,
  allItems: PropTypes.shape().isRequired,
  checkDragDropCategory: PropTypes.func.isRequired,
};

export default Model;
