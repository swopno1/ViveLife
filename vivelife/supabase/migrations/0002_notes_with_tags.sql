create or replace function get_notes_with_tags()
returns table (
    id bigint,
    user_id uuid,
    title text,
    content text,
    created_at timestamptz,
    tags json
)
language plpgsql
as $$
begin
  return query
    select
      n.id,
      n.user_id,
      n.title,
      n.content,
      n.created_at,
      coalesce(
        (
          select json_agg(json_build_object('id', t.id, 'name', t.name))
          from note_tags nt
          join tags t on nt.tag_id = t.id
          where nt.note_id = n.id
        ),
        '[]'::json
      ) as tags
    from
      notes n
    where
      n.user_id = auth.uid()
    order by
      n.created_at desc;
end;
$$;
