import { Tabs as BaseTabs } from '@base-ui/react/tabs'

export function Tabs({
  items,
  defaultValue,
  value,
  onValueChange,
  className = '',
}) {
  return (
    <BaseTabs.Root
      className={`ds-tabs ${className}`}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      value={value}
    >
      <BaseTabs.List className="ds-tabs__list">
        {items.map((item) => (
          <BaseTabs.Tab
            className="ds-tabs__tab"
            key={item.value}
            value={item.value}
          >
            {item.label}
          </BaseTabs.Tab>
        ))}
        <BaseTabs.Indicator className="ds-tabs__indicator" />
      </BaseTabs.List>
      {items.map((item) => (
        <BaseTabs.Panel
          className="ds-tabs__panel"
          key={item.value}
          value={item.value}
        >
          {item.content}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  )
}
