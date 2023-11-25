export const AreaType = ["image", "dimension"] as const

export const defaultSide = {
  title: "",
  areaType: AreaType[0],
  dimension: null,
  subcategoryId: Number.MAX_SAFE_INTEGER,
}
