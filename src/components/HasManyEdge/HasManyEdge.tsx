import { HasAnyEdge } from "@/components"
import { hasManyEdgePartial, HasManyEdgeDataType } from "@/zustandStore"
import { EdgeProps } from "@xyflow/react"

export type HasManyEdgePropsType = Required<Pick<EdgeProps, "id" | "source" | "target" | "label" | "selected" | "data" >>

export const HasManyEdge = (props: HasManyEdgePropsType) => (
  <HasAnyEdge type={hasManyEdgePartial.type} {...props} />
)
