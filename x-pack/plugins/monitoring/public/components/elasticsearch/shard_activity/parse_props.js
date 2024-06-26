/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { capitalize } from 'lodash';
import { formatMetric } from '../../../lib/format_number';
import { formatDateTimeLocal } from '../../../../common/formatting';

const getIpAndPort = (transport) => {
  if (transport !== undefined) {
    const matches = transport.match(/([\d\.:]+)\]$/);
    if (matches) {
      return matches[1];
    }
  }
  return transport;
};

const normalizeString = (text) => {
  return capitalize(text.toLowerCase());
};

export const parseProps = (props) => {
  const {
    id,
    stage,
    index,
    index_name: indexName,
    name: mbIndexName,
    primary: isPrimary,
    start_time_in_millis: startTimeInMillis,
    total_time_in_millis: totalTimeInMillis,
    start_time: mbStartTime,
    total_time: mbTotalTime,
    source = {}, // This property is potentially undefined due to a legacy search where `source` is optionally existing
    target = {}, // This property is potentially undefined due to a legacy search where `target` is optionally existing
    translog,
    type,
    timezone,
  } = props;

  const { files, size } = index;

  return {
    name: indexName || mbIndexName,
    shard: `${id} / ${isPrimary ? 'Primary' : 'Replica'}`,
    relocationType: type === 'PRIMARY_RELOCATION' ? 'Primary Relocation' : normalizeString(type),
    stage: normalizeString(stage),
    startTime: formatDateTimeLocal(startTimeInMillis || mbStartTime?.ms, timezone),
    totalTime: formatMetric(Math.floor((totalTimeInMillis || mbTotalTime?.ms) / 1000), '00:00:00'),
    isCopiedFromPrimary: !isPrimary || type === 'PRIMARY_RELOCATION',
    sourceName: source.name === undefined ? 'n/a' : source.name,
    targetName: target.name,
    sourceTransportAddress: getIpAndPort(source.transport_address),
    targetTransportAddress: getIpAndPort(target.transport_address),
    isSnapshot: type === 'SNAPSHOT',
    repo: source.repository,
    snapshot: source.snapshot,
    filesPercent: files.percent,
    filesDone: files.reused ? files.reused : files.recovered,
    filesTotal: files.total,
    bytesPercent: size.percent,
    bytesDone: formatMetric(size.recovered_in_bytes + size.reused_in_bytes, 'byte'),
    bytesTotal: formatMetric(size.total_in_bytes, 'byte'),
    hasTranslog: translog.total > 0,
    translogPercent: translog.percent,
    translogDone: translog.total,
    translogTotal: translog.total_on_start,
  };
};
